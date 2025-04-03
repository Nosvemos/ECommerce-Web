'use client'

import { Cart } from '@/types'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import ProductQuantityButton from '@/components/shared/product/product-quantity-button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, round2 } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Loader, ArrowRightToLine } from 'lucide-react'

const CartTable = ({ cart } : { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const checkoutButtonHandler = () => {
    startTransition(() => router.push('/shipping-address'))
  }

  return (
    <div>
      <h1 className='h2-bold py-4'>Shopping Cart</h1>
      { !cart || cart.items.length === 0 ? (
        <div>
          <span>Cart is empty.</span>{' '}
          <Link className='font-semibold' href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
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
                    <TableCell className='flex-center gap-2'>
                      <ProductQuantityButton cart={cart} item={item} />
                    </TableCell>
                    <TableCell className='text-right'>
                      ${(round2(item.price)) * item.qty}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h1 className='pb-2 text-xl'>
                Subtotal ({ cart.items.reduce((a, i) => a + i.qty, 0)}):{' '}
                <span className='font-bold'>
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </h1>
              <Button className='w-full' disabled={isPending} onClick={checkoutButtonHandler}>
                { isPending ? (
                  <Loader className='size-4 animate-spin'/>
                ) : (
                  <ArrowRightToLine className="size-4" />
                )}{' '}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CartTable