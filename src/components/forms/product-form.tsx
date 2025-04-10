'use client'

import { Product } from '@/types'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { z } from 'zod'
import { insertProductSchema, updateProductSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { PRODUCT_DEFAULT_VALUES } from '@/lib/constants'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import slugify from 'slugify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const ProductForm = ({ type, product, productId } : {
  type: 'Create' | 'Update',
  product?: Product,
  productId?: string
}) => {
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(type === 'Update' ? updateProductSchema : insertProductSchema),
    defaultValues: product && type === 'Update' ? product : PRODUCT_DEFAULT_VALUES
  });

  return (
    <Form {...form}>
      <form className='space-y-8'>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Name */}
          <FormField control={form.control} name='name' render={({ field } : { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'> }) => (
            <FormItem className='w-full'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter product name' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} />
          {/* Slug */}
          <FormField control={form.control} name='slug' render={({ field } : { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'> }) => (
            <FormItem className='w-full'>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className='flex items-center gap-2'>
                  <Input placeholder='Enter slug' {...field} />
                  <Button type='button' className='shrink-0' onClick={() => {
                    form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
                  }}>Generate</Button>
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Category */}
          <FormField control={form.control} name='category' render={({ field } : { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'> }) => (
            <FormItem className='w-full'>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder='Enter category' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} />
          {/* Brand */}
          <FormField control={form.control} name='brand' render={({ field } : { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'> }) => (
            <FormItem className='w-full'>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder='Enter brand' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Price */}
          <FormField control={form.control} name='price' render={({ field } : { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'> }) => (
            <FormItem className='w-full'>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder='Enter product price' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} />
          {/* Stock */}
          <FormField control={form.control} name='stock' render={({ field } : { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'> }) => (
            <FormItem className='w-full'>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input placeholder='Enter stock' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} />
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* Images */}
        </div>
        <div className='upload-field'>
          {/* isFeatured */}
        </div>
        <div>
          {/* Description */}
          <FormField control={form.control} name='description' render={({ field } : { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'> }) => (
            <FormItem className='w-full'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='Enter product description' className='resize-none' {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} />
        </div>
        <div>
          {/* Submit */}
          <Button type='submit' disabled={form.formState.isSubmitting}>
            { form.formState.isSubmitting ? 'Submitting...' : `${type} Product` }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm