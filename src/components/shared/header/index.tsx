import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import Menu from '@/components/shared/header/menu'
import CategoryDrawer from '@/components/shared/header/category-drawer'

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <CategoryDrawer />
          <Link href='/' className='flex-start ml-4'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} Logo`}
              width={48}
              height={48}
              priority={true}
            />
            <span className='hidden md:block font-bold text-2xl ml-3'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu/>
      </div>
    </header>
  )
}

export default Header