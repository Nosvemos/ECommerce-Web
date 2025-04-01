import ModeToggle from '@/components/shared/header/mode-toggle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, ShoppingCart, UserIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const ResponsiveMenu = () => {
  return (
    <div className='flex justify-end gap-3'>
      <nav className='hidden md:flex w-full max-w-xs gap-1'>
        <ModeToggle/>
        <Button variant='ghost' asChild>
          <Link href='/cart'>
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href='/sign-in'>
            <UserIcon /> Sign In
          </Link>
        </Button>
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <Menu/>
          </SheetTrigger>
          <SheetContent className='flex flex-col items-start p-5'>
            <SheetTitle>
              Menu
            </SheetTitle>
            <ModeToggle/>
            <Button variant='ghost' asChild>
              <Link href='/cart'>
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Button asChild>
              <Link href='/sign-in'>
                <UserIcon /> Sign In
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default ResponsiveMenu