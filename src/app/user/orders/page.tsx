import { Metadata } from 'next'
import { getUserOrders } from '@/lib/actions/order.actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import Link from 'next/link'

export const metadata : Metadata = {
  title: 'My Orders'
}

const OrdersPage = async (props: {
  searchParams: Promise<{page: string}>
}) => {
  const { page } = await props.searchParams;

  const orders= await getUserOrders({
    page: Number(page) || 1
  });

  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Orders</h2>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
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
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{ order.isPaid && order.paidAt? formatDateTime(order.paidAt).dateTime : 'Not Paid'}</TableCell>
                <TableCell>{ order.isDelivered && order.deliveredAt? formatDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                    <span className='px-2'>Details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default OrdersPage