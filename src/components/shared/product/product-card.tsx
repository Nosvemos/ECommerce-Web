import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import ProductPrice from '@/components/shared/product/product-price'
import { Product } from '@/types'

const ProductCard = ({ product } : {
  product : Product
}) => {
  return (
    <Card className='w-full max-w-[300px] mx-auto pt-0'>
      <CardHeader className='p-0 items-center'>
        <Link href={`/product/${product.slug}`}>
          <Image className='rounded-t-md w-full aspect-square object-cover' src={product.images[0]} alt={product.name} height={300} width={300} priority={true} />
        </Link>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <span className='text-xs'>{product.brand}</span>
        <Link href={`/product/${product.slug}`}>
          <h2 className='text-sm font-medium'>{product.name}</h2>
        </Link>
        <div className='flex-between gap-4'>
          <p>{product.rating} Stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)}/>
          ) : (
            <p className='text-destructive'>Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard