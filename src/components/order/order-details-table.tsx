'use client'

import { Order } from '@/types'
import { formatCurrency, formatDateTime, formatId, round2 } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import Image from 'next/image'
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js'
import {
  approvePayPalOrder,
  createPayPalOrder,
  deliverOrder,
  updateCashOnDeliveryOrderToPaid
} from '@/lib/actions/order.actions'
import { toast } from 'sonner';
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'

const OrderDetailsTable = ({ order, paypalClientId, isAdmin } : { order: Order, paypalClientId: string, isAdmin: boolean }) => {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';

    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error while loading PayPal';
    }
    return status;
  }

  const handleCreatePayPalOrder : PayPalButtonsComponentProps["createOrder"] = async() => {
    const res = await createPayPalOrder(order.id);
    if (!res.success) return toast.error(res.message);

    return res.data;
  }

  const handleApprovePayPalOrder: PayPalButtonsComponentProps["onApprove"] = async (data: {orderID: string}) => {
    approvePayPalOrder(order.id, data)
      .then(res => {
        if (!res.success) return toast.error(res.message);
          toast.success(res.message);
      })
      .catch(() => toast.error('Payment processing failed'));
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button type='button' disabled={isPending} onClick={() => startTransition(async () => {
        updateCashOnDeliveryOrderToPaid(order.id).then((res) => {
          if (!res.success) return toast.error(res.message);
          toast(res.message);
        })
      })}>
        {isPending ? 'Processing...' : 'Mark as paid'}
      </Button>
    )
  }

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button type='button' disabled={isPending} onClick={() => startTransition(async () => {
        deliverOrder(order.id).then((res) => {
          if (!res.success) return toast.error(res.message);
          toast(res.message);
        })
      })}>
        {isPending ? 'Processing...' : 'Mark as delivered'}
      </Button>
    )
  }

  return (
    <>
      <h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>
                  Not Paid
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card className='my-2'>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p className='mb-2'>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}{', '}{shippingAddress.city}
              </p>
              <p className='mb-2'>
                {shippingAddress.postalCode}{', '}{shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant='secondary'>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>
                  Not Delivered
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className='flex items-center'>
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className='text-center'>
                        <span className='px-2'>{item.qty}</span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <span className='px-2'>{formatCurrency((round2(item.price)) * item.qty)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4 text-sm'>
              <div className='flex justify-between'>
                <span>Items</span>
                <span>{ formatCurrency(itemsPrice) }</span>
              </div>
              <div className='flex justify-between'>
                <span>Tax</span>
                <span>{ formatCurrency(taxPrice) }</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>{ formatCurrency(shippingPrice) }</span>
              </div>
              <div className='flex justify-between text-base font-semibold'>
                <span>Total Price</span>
                <span>{ formatCurrency(totalPrice) }</span>
              </div>
              {/* PayPal Payment */}
              { !isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{clientId: paypalClientId}}>
                    <PrintLoadingState/>
                    <PayPalButtons createOrder={handleCreatePayPalOrder} onApprove={handleApprovePayPalOrder} />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Mark order as paid (only CashOnDelivery) */}
              { isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && <MarkAsPaidButton/>}

              {/* Mark order as delivered */}
              { isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton/>}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsTable