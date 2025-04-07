import Link from 'next/link'
import Image from 'next/image'
import { APP_NAME } from '@/lib/constants'
import Menu from '@/components/shared/header/menu'
import MainNav from '@/components/shared/main-nav'

const links = [
  {
    title: 'Profile',
    href: '/user/profile'
  },
  {
    title: 'Orders',
    href: '/user/orders'
  },
];

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='border-b container mx-auto'>
          <div className='flex items-center h-16 px-4'>
            <Link href='/' className='flex-start'>
              <Image src='/images/logo.svg' alt={APP_NAME} height={48} width={48} priority={true}/>
            </Link>
            <MainNav links={links} className='mx-6'/>
            <div className='ml-auto items-center flex space-x-4'>
              <Menu/>
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-4 p-8 pt-6 container mx-auto'>
          {children}
        </div>
      </div>
    </>
  );
}