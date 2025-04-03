'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import { toast } from 'sonner'
import { Cart, CartItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Loader, Minus, Plus } from 'lucide-react'

const ProductQuantityButton = ({ cart, item } : { cart?: Cart, item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // Handle add item to cart
  const handleAddToCart = async () => {
    startTransition(() => {
      addItemToCart(item)
        .then(res => {
          if (!res.success) return toast.error(res.message);

          toast(res.message, {
            action: {
              label: 'Go to Cart',
              onClick: () => router.push('/cart'),
            },
          });
        });
    });
  }

  // Handle remove from cart
  const handleRemoveFromCart = async() => {
    startTransition(async() => {
      removeItemFromCart(item.productId)
        .then(res => {
          if (!res.success) return toast.error(res.message);

          toast(res.message, {
            action: {
              label: 'Go to Cart',
              onClick: () => router.push('/cart'),
            },
          });
        });
    });
  }

  const existItem = cart && cart.items.find((x) => x.productId === item.productId);
  return existItem ? (
    <div className="flex items-center">
      <Button type='button' variant='outline' onClick={handleRemoveFromCart} disabled={isPending}>
        <Minus className="size-4" />
      </Button>
      <div className="px-2">
        { isPending ? (
          <Loader className='size-4 animate-spin'/>
        ) : (
          <span>
          {existItem.qty}
        </span>
        )}
      </div>
      <Button type='button' variant='outline' onClick={handleAddToCart} disabled={isPending}>
        <Plus className="size-4" />
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart} disabled={isPending}>
      { isPending ? (
        <Loader className='size-4 animate-spin'/>
      ) : (
        <Plus className="size-4" />
      )}{' '}
      Add to Cart
    </Button>
  )
}

export default ProductQuantityButton