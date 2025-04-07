import { auth } from '@/auth'
import Link from 'next/link'
import { LogOut, UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Form from 'next/form'
import { signOutUser } from '@/lib/actions/user.actions'

const UserButton = async () => {
  const session = await auth();
  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> Sign In
        </Link>
      </Button>
    )
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            <Button variant='ghost' className='relative size-8 rounded-full ml-2 flex items-center justify-center bg-secondary border'>
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <span className='text-sm font-medium leading-none'>
                {session.user?.name}
              </span>
              <span className='text-sm text-muted-foreground leading-none'>
                {session.user?.email}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href='/user/profile' className='w-full'>
              User Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href='/user/orders' className='w-full'>
              Order History
            </Link>
          </DropdownMenuItem>

          { session?.user?.role === 'admin' && (
            <DropdownMenuItem>
              <Link href='/admin/overview' className='w-full'>
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className='p-0 mb-1'>
            <Form action={signOutUser} className='w-full'>
              <Button className='py-4 px-2 h-4 justify-start w-full' variant='ghost'>
                <LogOut/>
                <span>Sign Out</span>
              </Button>
            </Form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserButton