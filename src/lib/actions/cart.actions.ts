'use server'

import { CartItem } from '@/types'
import { convertToPlainObject, formatError, round2 } from '@/lib/utils'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { cartItemSchema, insertCartSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10), // Shipping price will be 10 dollars if items price is under 100 dollars
    taxPrice = round2(itemsPrice * 0.15), // %15 tax-rate
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

export async function addItemToCart (data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId
      }
    });
    if (!product) throw new Error('Product not found');

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item])
      });

      // Add to database
      await prisma.cart.create({
        data: newCart
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} added to cart`,
      }
    } else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);
      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) throw new Error(`Not enough stock for ${existItem.name}`);

        // Increase the quantity
        (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty + 1;
      } else {
        // If item does not exist in cart

        // Check stock
        if (product.stock < 1) throw new Error(`Not enough stock for ${product.name}`);

        // Add item to the cart.items
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: {
          id: cart.id
        },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[])
        }
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getMyCart () {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
    totalPrice: cart.totalPrice.toString()
  })
}

export async function removeItemFromCart (productId: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get product
    const product = await prisma.product.findFirst({
      where: {
        id: productId
      }
    });
    if (!product) throw new Error('Product not found');

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // Check for item
    const exist = (cart.items as CartItem[]).find((x) => x.productId === productId);
    if(!exist) throw new Error('Product not exist');

    // For dynamic message
    const oldQty = exist.qty;

    // Check if only one in quantity
    if (exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId);
    } else {
      // Decrease quantity
      (cart.items as CartItem[]).find((x) => x.productId === exist.productId)!.qty = exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[])
      }
    });

    // Revalidate product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was ${oldQty === 1 ? 'removed from' : 'updated in'} cart`,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}