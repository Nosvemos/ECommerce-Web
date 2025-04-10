'use client'

import { Product } from '@/types'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { insertProductSchema, updateProductSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { PRODUCT_DEFAULT_VALUES } from '@/lib/constants'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import slugify from 'slugify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { UploadDropzone } from '@/lib/uploadthing'
import { twMerge } from 'tailwind-merge'
import { Checkbox } from '@/components/ui/checkbox'

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

  const onSubmit:SubmitHandler<z.infer<typeof insertProductSchema>> = async (values) => {
    // On Create
    if (type === 'Create') {
      const res = await createProduct(values);
      if (!res.success) return toast.error(res.message);

      toast(res.message);
      router.push('/admin/products');
    }

    // On Update
    else if (type === 'Update') {
      if (!productId) return toast.error('Product ID not found');

      const res = await updateProduct({ ...values, id: productId });
      if (!res.success) return toast.error(res.message);

      toast(res.message);
      router.push('/admin/products');
    }
  }

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
          <FormField control={form.control} name='images' render={() => (
            <FormItem className='w-full'>
              <FormLabel>Images</FormLabel>
              <Card>
                <CardContent className='space-y-2 mt-2 min-h-48'>
                  <FormControl>
                    <UploadDropzone
                      config={{ cn: twMerge }}
                      className='w-full border-0 ut-button:text-sm ut-button:font-medium ut-button:bg-primary ut-button:ut-readying:bg-primary/80 ut-button:text-primary-foreground ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground'
                      endpoint='imageUploader'
                      onUploadError={(error: Error) => {
                        toast.error(`Error! ${error.message}`);
                      }}
                      onClientUploadComplete={(res: { url: string }[]) => {
                       form.setValue('images', [...images, res[0].url ]);
                      }}
                    />
                  </FormControl>
                  <div className='flex md:flex-row gap-2'>
                    { images.map((image: string) => (
                      <Image key={image} src={image} alt='Product Image' className='size-30 object-center object-cover rounded-sm' width={200} height={200} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <FormMessage/>
            </FormItem>
          )} />
        </div>
        <div className='upload-field'>
          {/* isFeatured */}
          <div className='flex gap-2'>
            <span className='text-sm font-semibold'>Featured Content</span>
            <FormField control={form.control} name='isFeatured' render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />
          </div>
          { isFeatured && banner && (
            <Image src={banner} alt='Banner Image' className='w-full object-cover object-center rounded-sm' width={1920} height={680} />
          )}
          { isFeatured && !banner && (
            <Card className='mt-2'>
              <CardContent className='space-y-2 mt-2 min-h-48'>
                <FormControl>
                  <UploadDropzone
                    config={{ cn: twMerge }}
                    endpoint='imageUploader'
                    className='w-full border-0 ut-button:text-sm ut-button:font-medium ut-button:bg-primary ut-button:ut-readying:bg-primary/80 ut-button:text-primary-foreground ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground'
                    onUploadError={(error: Error) => {
                      toast.error(`Error! ${error.message}`);
                    }}
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue('banner', res[0].url);
                    }}
                  />
                </FormControl>
                <div className='flex md:flex-row gap-2'>
                  { images.map((image: string) => (
                    <Image key={image} src={image} alt='Product Image' className='size-30 object-center object-cover rounded-sm' width={200} height={200} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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