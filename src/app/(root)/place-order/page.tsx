import { Metadata } from 'next'
import { getMyCart } from '@/lib/actions/cart.actions'
import { auth } from '@/auth'
import { getUserById } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { ShippingAddress } from '@/types'
import CheckoutSteps from '@/components/shared/checkout-steps'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { formatCurrency, round2 } from '@/lib/utils'
import PlaceOrderForm from '@/components/forms/place-order-form'

export const metadata : Metadata = {
  title: 'Place Order'
}

const PlaceOrderPage = async() => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className='py-4 text-2xl'>Place Order</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}, {' '}
                {userAddress.postalCode}, {userAddress.country}, {' '}
              </p>
              <div className='mt-3'>
                <Link href='/shipping-address'>
                  <Button variant='outline'>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <div className='mt-3'>
                <Link href='/payment-method'>
                  <Button variant='outline'>Edit</Button>
                </Link>
              </div>
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
                  {cart.items.map((item) => (
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
                <span>{ formatCurrency(cart.itemsPrice) }</span>
              </div>
              <div className='flex justify-between'>
                <span>Tax</span>
                <span>{ formatCurrency(cart.taxPrice) }</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>{ formatCurrency(cart.shippingPrice) }</span>
              </div>
              <div className='flex justify-between text-base font-semibold'>
                <span>Total Price</span>
                <span>{ formatCurrency(cart.totalPrice) }</span>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default PlaceOrderPage