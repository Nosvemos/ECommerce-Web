const StripePayment = ({ priceInCents, orderId, clientSecret } : {
  priceInCents: number,
  orderId: string,
  clientSecret: string
}) => {
  return (
    <div>Stripe Payment</div>
  )
}

export default StripePayment