import ProductCard from '@/components/shared/product/product-card'
import { Product } from '@/types'

const ProductList = ({ data, title, limit } : {
  data: Product[], // Only for now
  title?: string,
  limit?: number
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className='my-10'>
      <h2 className='h2-bold mb-4 text-center sm:text-left'>{title}</h2>
      { limitedData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product}></ProductCard>
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  )
}

export default ProductList