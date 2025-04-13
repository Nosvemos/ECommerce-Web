import { getAllProducts } from '@/lib/actions/product.actions'
import ProductCard from '@/components/shared/product/product-card'

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>
}) => {
  const {q = 'all', category = 'all', price = 'all', rating = 'all', sort = 'newest', page = '1'} = await props.searchParams;

  // Construct filter URL
  const getFilteredUrl = ({
    c,
    p,
    r,
    s,
    pg
  } : {
    c?: string;
    p?: string;
    r?: string;
    s?: string;
    pg?: string;
  }) => {
    const params = {q, category, price, rating, sort, page};
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (s) params.sort = s;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  }

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page)
  });
  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        {/* Filters */}
      </div>
      <div className='md:col-span-4 space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products.data.length === 0 && (
            <span>No products found</span>
          )}
          {products.data.map(product => (
            <ProductCard key={product.id} product={product}></ProductCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage