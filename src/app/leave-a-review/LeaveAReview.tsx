'use client';

import Image from 'next/image';
import React, {useState} from 'react';
import {useSearchParams} from 'next/navigation';

import {URLS} from '../../config';
import {Routes} from '../../routes';
import {components} from '../../components';
import {hooks} from '../../hooks';
import {useReviewOrder} from '../../hooks/useOrderReview';

export const LeaveAReview: React.FC = () => {
  const router = hooks.useTrackedRouter();
  const searchParams = useSearchParams();
  const {submitReview} = useReviewOrder();

  const [rating, setRating] = useState<number>(0);
  const [reviewFromCostumer,setReviewFromCostumer] = useState("")

  // Get order and product IDs from URL params
  const orderIdStr = searchParams.get('order');
  const productIdStr = searchParams.get('product');


  const handleSubmitReview = async () => {
    if (!orderIdStr || !productIdStr || rating === 0 || !reviewFromCostumer) {
      // Basic validation, you might want to show a user-friendly message
      console.error('Missing order ID, product ID, rating, or review text.');
      return;
    }

    const order_id = parseInt(orderIdStr, 10);
    const product_id = parseInt(productIdStr, 10);

    if (isNaN(order_id) || isNaN(product_id)) {
      console.error('Order ID or Product ID is not a valid number.');
      return;
    }

    try {
      await submitReview({
        order_id,
        product_id,
        rating,
        review: reviewFromCostumer,
      });
      // If submitReview completes without throwing an error, consider it a success
      router.push(Routes.TAB_NAVIGATOR);
    } catch (error) {
      // Error is already logged by the hook, but you could add UI feedback here
      console.error('Failed to submit review from component:', error);
    }
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Leave a review'
      />
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable container'>
        <section
          style={{
            padding: 20,
            marginTop: 10,
            marginBottom: 20,
            borderRadius: 10,
            backgroundColor: 'var(--white-color)',
          }}
        >
          <Image
            width={0}
            height={0}
            sizes='100vw'
            alt='rate service'
            className='status-img'
            style={{
              margin: '0 auto',
              marginBottom: 14,
              width: '60%',
              height: 'auto',
            }}
            src={`${URLS.MAIN_URL}/assets/images/08.jpg`}
          />
          <h2
            style={{
              textTransform: 'capitalize',
              textAlign: 'center',
              marginBottom: 14,
            }}
          >
            Please rate the quality of <br /> service for the order!
          </h2>
          <components.RatingStars
            rating={rating}
            setRating={setRating}
            containerStyle={{marginBottom: 20}}
          />
          <p
            className='t16'
            style={{textAlign: 'center'}}
          >
            Your comments and suggestions help <br /> us improve the service
            quality better!
          </p>
          <div style={{marginBottom: 20}}>
            <textarea
              placeholder='Enter your comment'
              value={reviewFromCostumer}
              style={{
                height: 127,
                width: '100%',
                padding: 14,
                marginTop: 20,
                borderRadius: 10,
                border: 'none',
                fontSize: 16,
                fontFamily: 'DM Sans',
                color: '#748BA0',
                backgroundColor: '#E9F3F6',
                resize: 'none',
              }}
              onChange={(e)=>{setReviewFromCostumer(e.target.value)}}
            />
          </div>
          <components.Button
            label='Send review'
            onClick={handleSubmitReview}
            // disabled={reviewSubmissionLoading}
          />
        </section>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
