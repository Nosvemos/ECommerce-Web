'use client'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'

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

const MainNav = ({ className, ...props } : React.HTMLAttributes<HTMLElement> ) => {
  const pathName = usePathname();
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {links.map((item) => (
        <Link href={item.href} key={item.href} className={cn('text-sm font-medium transition-colors hover:text-primary', pathName.includes(item.href) ? '' : 'text-muted-foreground')}>
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export default MainNav