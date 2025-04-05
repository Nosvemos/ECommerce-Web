'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { auth } from '@/auth'
import { getMyCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { insertOrderSchema } from '@/lib/validators'
import { prisma } from '@/db/prisma'
import { CartItem, PaymentResult } from '@/types'
import { paypal } from '@/lib/paypal'
import { revalidatePath } from 'next/cache'

// Create order and create the order items
export async function createOrder () {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    const cart = await getMyCart();

    const userId = session?.user?.id;
    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Cart is empty',
        redirectTo: '/cart'
      }
    }

    if (!user.address) {
      return {
        success: false,
        message: 'Shipping address is not provided',
        redirectTo: '/shipping-address'
      }
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'Payment method is not selected',
        redirectTo: '/payment-method'
      }
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: userId,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    });

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });

      // Create order items from cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id
          }
        });
      }

      // Clear cart
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0
        }
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error('Order could not created');

    return {
      success: true,
      message: 'Order created',
      redirectTo: `/order/${insertedOrderId}`
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error)
    }
  }
}

// Get order by id
export async function getOrderById (orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId
    },
    include: {
      orderItems: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  return convertToPlainObject(data);
}

// Create new PayPal order
export async function createPayPalOrder (orderId: string) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      }
    });
    if (!order) throw new Error('Order not found');

    // Create PayPal order
    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

    // Update order with PayPal order id
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          email_address: '',
          status: '',
          pricePaid: 0
        }
      }
    });

    return {
      success: true,
      message: 'PayPal order created',
      data: paypalOrder.id
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}