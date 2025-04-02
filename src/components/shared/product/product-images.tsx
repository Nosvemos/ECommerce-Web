'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils'

const ProductImages = ({ images } : { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className='space-y-4'>
      <Image src={images[current]} alt='Product Image' width={1000} height={1000} className='min-h-[300px] object-cover object-center' />
      <div className='flex'>
        {images.map((image, index) => (
          <div className={cn('rounded-sm border mr-2 cursor-pointer hover:border-neutral-500', current === index && 'border-neutral-400')} key={index} onClick={() => {setCurrent(index)}}>
            <Image className='rounded-sm' src={image} alt={`Product Image ${index}`} width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages