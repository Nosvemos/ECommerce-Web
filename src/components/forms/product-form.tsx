'use client'

import { Product } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { insertProductSchema, updateProductSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { PRODUCT_DEFAULT_VALUES } from '@/lib/constants'
import { Form } from '@/components/ui/form'

const ProductForm = ({ type, product, productId } : {
  type: 'Create' | 'Update',
  product?: Product,
  productId?: string
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(type === 'Update' ? updateProductSchema : insertProductSchema),
    defaultValues: product && type === 'Update' ? product : PRODUCT_DEFAULT_VALUES
  });

  return (
    <Form {...form}>
      <form className='space-y-8'>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Name */}
          {/* Slug */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Category */}
          {/* Brand */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Price */}
          {/* Stock */}
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* Images */}
        </div>
        <div className='upload-field'>
          {/* isFeatured */}
        </div>
        <div>
          {/* Description */}
        </div>
        <div>
          {/* Submit */}
        </div>
      </form>
    </Form>
  )
}

export default ProductForm