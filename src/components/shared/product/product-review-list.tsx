'use client'

import { useState } from 'react'
import { Review } from '@/types'
import Link from 'next/link'
import ProductReviewForm from '@/components/forms/product-review-form'

const ProductReviewList = ({ userId, productId, productSlug } : {
  userId: string,
  productId: string,
  productSlug: string,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const reload = () => {
    console.log('Review submitted');
  }

  return (
    <div className='space-y-4'>
      {reviews.length === 0 && (
        <div>No reviews yet</div>
      )}
      { userId ? (
        <ProductReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
      ) : (
        <div>
          Please<Link href={`/sign-in?callbackUrl=/product/${productSlug}`} className='text-blue-700 hover:text-blue-800 hover:underline px-2 link'>sign in</Link>to write a review
        </div>
      )}
      <div className='flex flex-col gap-3'>
        {/* Reviews */}
      </div>
    </div>
  )
}

export default ProductReviewList