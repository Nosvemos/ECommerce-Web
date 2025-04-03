import { getProductBySlug } from '@/lib/actions/product.actions'
import { notFound } from 'next/navigation'
import ProductPrice from '@/components/shared/product/product-price'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProductImages from '@/components/shared/product/product-images'
import AddToCart from '@/components/shared/product/add-to-cart'
import { getMyCart } from '@/lib/actions/cart.actions'

const ProductDetailsPage = async(props: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cart = await getMyCart();

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
        {/* Images Column */}
        <div className="md:col-span-2 col-span-2">
          <ProductImages images={product.images} />
        </div>
        <div className='col-span-2 p-5'>
          <div className='flex flex-col gap-6'>
            <p>{product.brand} {product.category}</p>
            <h3 className='h3-bold'>{product.name}</h3>
            <p>{product.rating} of {product.numReviews} Reviews</p>
            <div className='flex flex-col md:flex-row md:items-center gap-3'>
              <ProductPrice value={Number(product.price)} className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2' />
            </div>
          </div>
          <div className='mt-10'>
            <p className='font-semibold'>Description</p>
            <p>{product.description}</p>
          </div>
        </div>
        {/* Action Column */}
        <div className='col-span-1 md:col-span-4 lg:col-span-1 mt-0 md:mt-2'>
          <Card className='bg-card/30'>
            <CardContent>
              <div className='mb-2 flex justify-between'>
                <p>Price</p>
                <ProductPrice value={Number(product.price)} />
              </div>
              <div className='mb-2 flex justify-between'>
                <p>Status</p>
                {product.stock > 0 ? (
                  <Badge variant='outline'>In Stock</Badge>
                ) : (
                  <Badge variant='destructive'>Out of Stock</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <div className='flex-center'>
                  <AddToCart
                    cart={cart}
                    item={{
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    qty: 1,
                    image: product.images![0]
                  }}/>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsPage