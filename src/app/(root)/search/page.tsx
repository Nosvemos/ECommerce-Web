import { getAllCategories, getAllProducts } from '@/lib/actions/product.actions'
import ProductCard from '@/components/shared/product/product-card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const prices = [
  {
    name: '$1 to $50',
    value: '1-50'
  },
  {
    name: '$51 to $100',
    value: '51-100'
  },
  {
    name: '$101 to $200',
    value: '101-200'
  },
  {
    name: '$201 to $500',
    value: '201-500'
  },
  {
    name: '$501 to $1000',
    value: '501-1000'
  },
];

const ratings = [4, 3, 2, 1];

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

  const categories = await getAllCategories();

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        {/* Category Links */}
        <h1 className='text-xl mb-2 mt-3'>Department</h1>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link href={getFilteredUrl({c: 'all'})} className={cn('', (category === 'all' || category === '') && 'font-bold')}>
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link href={getFilteredUrl({c: x.category})} className={cn('', (category === x.category) && 'font-bold')}>
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <h1 className='text-xl mb-2 mt-3'>Price</h1>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link href={getFilteredUrl({p: 'all'})} className={cn('', price === 'all' && 'font-bold')}>
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link href={getFilteredUrl({p: p.value})} className={cn('', (price === p.value) && 'font-bold')}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating Links */}
        <h1 className='text-xl mb-2 mt-3'>Customer Ratings</h1>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link href={getFilteredUrl({r: 'all'})} className={cn('', rating === 'all' && 'font-bold')}>
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link href={getFilteredUrl({r: `${r}`})} className={cn('', (rating === r.toString()) && 'font-bold')}>
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='md:col-span-4 space-y-4'>
        <div className='flex-between flex-col md:flex-row my-4'>
          <div className='flex items-center gap-2'>
            <span>{q !== 'all' && q !== '' && `Query: ${q}`}</span>
            <span>{category !== 'all' && category !== '' && `Category: ${category}`}</span>
            <span>{price !== 'all' && `Price: ${price}`}</span>
            <span>{rating !== 'all' && `Rating: ${rating} stars & up`}</span>
            {(q !== 'all' && q !== '') || (category !== 'all' && category !== '') || rating !== 'all' || price !== 'all' ? (
              <Button size='sm' variant='link' asChild>
                <Link href='/search'>Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            {/* Sorting */}
          </div>
        </div>
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