import { Metadata } from 'next'
import { getProductById } from '@/lib/actions/product.actions'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/forms/product-form'

export const metadata : Metadata = {
  title: 'Update Product'
}

const AdminProductUpdatePage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params;

  const product = await getProductById(id);
  if (!product) return notFound();

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h2 className='h2-bold'>Update Product</h2>
      <ProductForm type='Update' product={product} productId={product.id} />
    </div>
  )
}

export default AdminProductUpdatePage