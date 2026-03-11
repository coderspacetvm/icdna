import { useState, useCallback } from 'react'
import { createApiService } from '@/lib/axios/apiService'
import authClient from '@/lib/axios/authClient'
import { urls } from '@/lib/config/urls'

export type Rating = {
  id: number
  user: {
    profile_picture: string
    name: string
  } | null
  review: string
  average_rating: number
  created_at: string
  product: number
  order: number
}

type RatingsResponse = {
  status: number
  ratings: Rating[]
  error?: string
}

export type GetReviewReturn = {
  status: number
  message: string
  data?: Rating[]
  error?: string
}

interface UserReviewOrderReturn {
  reviews: Rating[] | null
  reviewLoading: boolean
  getReviewAndRating: () => void
  submitReview: (args: {
    order_id: number
    product_id: number
    rating: number
    review: string
  }) => Promise<boolean>
  reviewSubmissionLoading:boolean
}

const privateApiService = createApiService(authClient)

export const useReviewOrder = (): UserReviewOrderReturn => {
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewSubmissionLoading, setReviewSubmissionLoading] = useState(false)
  const [reviews, setReviews] = useState<Rating[] | null>(null)

  const getReviewAndRating = useCallback(async () => {
    setReviewLoading(true)
    try {
      const res = await privateApiService.get<RatingsResponse>(urls['add-rating'])
      if (res.status === 1) {
        setReviews(res.ratings)
      } else {
        console.error('Error:', res?.error || 'Unable to fetch the reviews')
      }
    } catch (error) {
      console.error('Unknown error while fetching reviews', error)
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const submitReview = useCallback( async ({
      order_id,
      product_id,
      rating,
      review,
    }: {
      order_id: number;
      product_id: number;
      rating: number;
      review: string;
    }) : Promise<boolean> => {
      setReviewSubmissionLoading(true);
      try {
        const res = await privateApiService.post(urls['add-rating'], {
          order_id,
          product_id,
          rating,
          review,
        });
        console.log('res',res);
        return true
      } catch (error) {
          console.error('Failed to submit review:', error);
        return false
      } finally {
        setReviewSubmissionLoading(false);
      }
    },[] );

  return {
    reviews,
    reviewLoading,
    getReviewAndRating,
    submitReview,
    reviewSubmissionLoading
  };
};
