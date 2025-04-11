import { Metadata } from 'next'
import { getAllUsers } from '@/lib/actions/user.actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateTime, formatId } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DeleteDialog from '@/components/shared/delete-dialog'
import { deleteOrder } from '@/lib/actions/order.actions'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'

export const metadata : Metadata = {
  title: 'Admin Users'
}

const AdminUserPage = async (props: {
  searchParams: Promise<{
    page: string
  }>
}) => {
  const { page = '1' } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page) });
  console.log(users);
  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Users</h2>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.map(user => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className='capitalize' variant={user.role === 'user' ? 'secondary' : 'default'}>{user.role}</Badge>
                </TableCell>
                <TableCell>{ formatDateTime(user.createdAt).dateTime }</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`admin/users/${user.id}`}>
                      Edit
                    </Link>
                  </Button>
                  {/* TODO
                    <DeleteDialog id={user.id} action={deleteUser} />
                  */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        { users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users.totalPages} />
        ) }
      </div>
    </div>
  )
}

export default AdminUserPage