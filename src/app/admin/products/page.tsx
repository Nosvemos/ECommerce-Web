import { getAllProducts } from '@/lib/actions/product.actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatId } from '@/lib/utils'
import Pagination from '@/components/shared/pagination'

const AdminProductsPage = async (props: {
  searchParams: Promise<{
    page: string,
    query: string,
    category: string
  }>
}) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({
    query: searchText,
    page,
    category
  });

  console.log(products);

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <h2 className='h2-bold'>Products</h2>
        <Button asChild>
          <Link href='/admin/products/create'>
            Create Product
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className='w-[100px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className='flex gap-1'>
                <Button variant='outline' size='sm' asChild>
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                {/* TODO Delete Action */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      { products?.totalPages && products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  )
}

export default AdminProductsPage