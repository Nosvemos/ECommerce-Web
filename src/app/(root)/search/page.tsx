import { getAllCategories, getAllProducts } from '@/lib/actions/product.actions'
import ProductCard from '@/components/shared/product/product-card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

const prices = [
  {
    name: `${DEFAULT_CURRENCY_SYMBOL}1 to ${DEFAULT_CURRENCY_SYMBOL}50`,
    value: '1-50'
  },
  {
    name: `${DEFAULT_CURRENCY_SYMBOL}51 to ${DEFAULT_CURRENCY_SYMBOL}100`,
    value: '51-100'
  },
  {
    name: `${DEFAULT_CURRENCY_SYMBOL}101 to ${DEFAULT_CURRENCY_SYMBOL}200`,
    value: '101-200'
  },
  {
    name: `${DEFAULT_CURRENCY_SYMBOL}201 to ${DEFAULT_CURRENCY_SYMBOL}500`,
    value: '201-500'
  },
  {
    name: `${DEFAULT_CURRENCY_SYMBOL}501 to ${DEFAULT_CURRENCY_SYMBOL}1000`,
    value: '501-1000'
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet = category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ''}
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}
      `,
    }
  } else {
    return {
      title: 'Search Products',
    }
  }
}

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
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link key={s} href={getFilteredUrl({s})} className={cn('mx-2', sort === s && 'font-bold')}>{s}</Link>
            ))}
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