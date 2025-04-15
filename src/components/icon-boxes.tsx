import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

const IconBoxes = () => {
  return (
    <div className='max-w-6xl mx-auto'>
      <Card className='border-0 shadow-none drop-shadow-none'>
        <CardContent className='grid md:grid-cols-4 gap-4 p-4'>
          <div className='space-y-2'>
            <ShoppingBag/>
            <div className='text-sm font-bold'>Free Shipping</div>
            <div className='text-sm text-muted-foreground'>Free shipping on order above {DEFAULT_CURRENCY_SYMBOL}100.</div>
          </div>
          <div className='space-y-2'>
            <DollarSign/>
            <div className='text-sm font-bold'>Money Back Guarantee</div>
            <div className='text-sm text-muted-foreground'>Within 30 days of purchase</div>
          </div>
          <div className='space-y-2'>
            <WalletCards />
            <div className='text-sm font-bold'>Flexible Payment</div>
            <div className='text-sm text-muted-foreground'>Pay with credit card, PayPal or CashOnDelivery</div>
          </div>
          <div className='space-y-2'>
            <Headset />
            <div className='text-sm font-bold'>24/7 Support</div>
            <div className='text-sm text-muted-foreground'>Get support at any time</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IconBoxes