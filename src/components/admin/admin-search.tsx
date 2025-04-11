'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes('/admin/orders') ? '/admin/orders' : pathname.includes('/admin/users') ? '/admin/users' : '/admin/products';

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);
  return (
    <form method='GET' action={formActionUrl}>
      <Input placeholder='Search...' type='search' name='query' value={queryValue} onChange={(e) => setQueryValue(e.target.value)} />
    </form>
  )
}

export default AdminSearch