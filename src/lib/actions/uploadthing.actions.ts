'use server';
import { UTApi } from 'uploadthing/server';
import { formatError } from '../utils';
import { prisma } from '@/db/prisma'

const utapi = new UTApi();

export async function deleteImage(imageUrl: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { images: { hasSome: [imageUrl] } },
          { banner: imageUrl }
        ]
      }
    });

    const updatePromises = products.map(product => {
      const updatedImages = product.images.filter(img => img !== imageUrl);
      const updatedBanner = product.banner === imageUrl ? null : product.banner;

      return prisma.product.update({
        where: { id: product.id },
        data: {
          images: updatedImages,
          banner: updatedBanner
        }
      });
    });

    await prisma.$transaction(updatePromises);

    const fileKey = imageUrl.split('/').pop();
    if (!fileKey) throw new Error('Invalid image URL');

    const deleteResult = await utapi.deleteFiles(fileKey);
    if (!deleteResult.success) {
      throw new Error('Failed to delete file from storage');
    }

    return {
      success: true,
      message: 'Image successfully removed from database and storage'
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    };
  }
}