'use client'

import { useEffect, useState } from 'react'
import { Review } from '@/types'
import Link from 'next/link'
import ProductReviewForm from '@/components/forms/product-review-form'
import { getReviews } from '@/lib/actions/review.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Loader2, User } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import Rating from '@/components/shared/product/rating'
import { toast } from 'sonner'

const ProductReviewList = ({ userId, productId, productSlug } : {
  userId: string,
  productId: string,
  productSlug: string,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const res = await getReviews(productId);
        setReviews(res.data);
      } catch (error) {
        toast.error("Failed to load reviews");
        console.error("Failed to load reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReviews();
  }, [productId]);

  // Reload reviews after submit
  const reload = async () => {
    setIsLoading(true);
    try {
      const res = await getReviews(productId);
      setReviews([...res.data]);
    } catch (error) {
      toast.error("Failed to reload reviews");
      console.error("Failed to reload reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='space-y-4'>
      {!isLoading && (
        userId ? (
          <ProductReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
        ) : (
          <div>
            Please <Link href={`/sign-in?callbackUrl=/product/${productSlug}`} className='text-blue-700 hover:text-blue-800 hover:underline px-2 link'>sign in</Link> to write a review
          </div>
        )
      )}

      {isLoading ? (
        <div className="flex py-8">
          <Loader2 className="size-4 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading reviews...</span>
        </div>
      ) : (
        <>
          {reviews.length === 0 && (
            <div>No reviews yet</div>
          )}
          <div className='flex flex-col gap-3'>
            {reviews.map(review => (
              <Card key={review.id}>
                <CardHeader className='space-y-2'>
                  <Rating value={review.rating} />
                  <div className='flex-between'>
                    <CardTitle>{review.title}</CardTitle>
                  </div>
                  <CardDescription>{review.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex space-x-4 text-sm text-muted-foreground'>
                    <div className='flex items-center'>
                      <User className='mr-1 size-3' />
                      {review.user ? review.user.name : 'User'}
                    </div>
                    <div className='flex items-center'>
                      <Calendar className='mr-1 size-3' />
                      {formatDateTime(review.createdAt).dateTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductReviewList