'use server';
import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '@/lib/constants'
import { revalidatePath } from 'next/cache'

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return convertToPlainObject(data);
}

// Get single product by its slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug
    }
  })
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category
} : {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  //TODO Category and Query
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Delete product
export async function deleteProduct (id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id
      }
    });
    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({
      where: {
        id
      }
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}