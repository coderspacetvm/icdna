import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '../config';
import {ReviewType} from '../types';

export const useGetReviews = (): {
  reviewsLoading: boolean;
  reviews: ReviewType[];
} => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);

  const getReviews = async () => {
    setReviewsLoading(true);

    try {
      const response = await axios.get(URLS.GET_REVIEWS);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return {reviewsLoading, reviews};
};
