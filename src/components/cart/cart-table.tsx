'use client'

import { Cart } from '@/types'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import ProductQuantityButton from '@/components/shared/product/product-quantity-button'

const CartTable = ({ cart } : { cart?: Cart }) => {
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
                      ${Number(item.price) * item.qty}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartTable