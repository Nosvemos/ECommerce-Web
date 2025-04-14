import { Metadata } from 'next'
import { getOrderById } from '@/lib/actions/order.actions'
import { notFound } from 'next/navigation'
import OrderDetailsTable from '@/components/order/order-details-table'
import { ShippingAddress } from '@/types'
import { auth } from '@/auth'
import Stripe from 'stripe'
import { DEFAULT_CURRENCY } from '@/lib/constants'

export const metadata : Metadata = {
  title: 'Order Details',
}

const OrderDetailsPage = async(props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  let client_secret = null;

  // Check if is not paid and using Stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Initialize Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: DEFAULT_CURRENCY,
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return <OrderDetailsTable
    isAdmin={ session?.user?.role === 'admin' || false }
    stripeClientSecret={ client_secret }
    paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'} order={{
      ...order,
      shippingAddress: order.shippingAddress as ShippingAddress,
    }}
  />;
}

export default OrderDetailsPage