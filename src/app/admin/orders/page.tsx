import { Metadata } from 'next'
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import Link from 'next/link'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import DeleteDialog from '@/components/shared/delete-dialog'
import { FunnelX } from 'lucide-react'
import { requireAdmin } from '@/lib/auth-guard'

export const metadata : Metadata = {
  title: 'Admin Orders'
}

const AdminOrdersPage = async (props: {
  searchParams: Promise<{
    page: string,
    query: string
  }>
}) => {
  const { page = '1', query: searchText } = await props.searchParams;

  await requireAdmin();

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText
  });

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <h2 className='h2-bold'>Orders</h2>
        { searchText && (
          <div className='flex items-center gap-2'>
            <span className='text-sm'>Filtered by <i>&quot;{ searchText }&quot;</i>{' '}</span>
            <Link href='/admin/orders'>
              <Button variant='outline' size='sm'>
                <FunnelX/>
              </Button>
            </Link>
          </div>
        ) }
      </div>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map(order => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{ order.isPaid && order.paidAt? formatDateTime(order.paidAt).dateTime : 'Not Paid'}</TableCell>
                <TableCell>{ order.isDelivered && order.deliveredAt? formatDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/order/${order.id}`}>
                      Details
                    </Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        { orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        ) }
      </div>
    </div>
  )
}

export default AdminOrdersPage