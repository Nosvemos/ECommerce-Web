'use client'

import { Order } from '@/types'
import { formatCurrency, formatDateTime, formatId, round2 } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import Image from 'next/image'

const OrderDetailsTable = ({ order } : { order: Order }) => {
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsTable