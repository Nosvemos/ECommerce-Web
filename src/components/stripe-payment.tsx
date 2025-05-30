import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeForm from '@/components/forms/stripe-form'
import { useTheme } from 'next-themes'

const StripePayment = ({ priceInCents, orderId, clientSecret } : {
  priceInCents: number,
  orderId: string,
  clientSecret: string
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const { theme, systemTheme } = useTheme();

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === 'dark'
              ? 'night'
              : theme === 'light'
                ? 'stripe'
                : systemTheme === 'light'
                  ? 'stripe'
                  : 'night',
          variables: {
            colorBackground: theme === 'dark'
              ? '#0e172a'
              : theme === 'light'
                ? ''
                : systemTheme === 'light'
                  ? ''
                  : '#0e172a',
          }
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  )
}

export default StripePayment