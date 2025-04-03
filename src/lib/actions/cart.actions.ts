'use server'

import { CartItem } from '@/types'

export async function addItemToCart (data: CartItem) {
  return {
    // Test
    success: false,
    message: 'There was an error adding the cart item',
  }
}