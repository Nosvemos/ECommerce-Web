import { cn, formatCurrency } from '@/lib/utils'

const ProductPrice = ({ value, className } : {
  value: number,
  className?: string
}) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split('.');
  return (
    <p className={cn('text-2xl', className)}>
      <span className='text-xs align-super'>{formatCurrency(value).toString().charAt(0)}</span>
      {intValue}
      <span className='text-xs align-super'>.{floatValue}</span>
    </p>
  )
}

export default ProductPrice