'use client'

import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Check, Loader } from 'lucide-react'
import React from 'react'
import { createOrder } from '@/lib/actions/order.actions'

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  }

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        { pending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Check className='size-4' />
        ) }{' '} Place Order
      </Button>
    )
  }
  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <PlaceOrderButton/>
    </form>
  )
}

export default PlaceOrderForm