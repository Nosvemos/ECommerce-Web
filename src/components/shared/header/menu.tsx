import ModeToggle from '@/components/shared/header/mode-toggle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import UserButton from '@/components/shared/header/user-button'

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
        <UserButton/>
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
            <UserButton/>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default ResponsiveMenu