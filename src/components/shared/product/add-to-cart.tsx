'use client'

import { toast } from "sonner"
import { CartItem } from '@/types'
import { Button } from '@/components/ui/button'
import { addItemToCart } from '@/lib/actions/cart.actions'
import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'

const AddToCart = ({ item } : { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) return toast.error(res.message);

    toast(`${item.name} added to cart`, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    })
  }
  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}><PlusIcon/>Add to Cart</Button>
  )
}

export default AddToCart