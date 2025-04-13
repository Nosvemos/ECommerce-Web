import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ViewAllProductsButton = () => {
  return (
    <div className='flex justify-center items-center my-8'>
      <Button size='lg' asChild>
        <Link href='/search'>View All Products</Link>
      </Button>
    </div>
  )
}

export default ViewAllProductsButton