'use client';

import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Import useRouter

import {hooks} from '../../hooks';
import {items} from '../../items';
import {components} from '../../components';

export const Reviews: React.FC = () => {
  // const router = useRouter(); // Initialize useRouter
  const {getReviewAndRating,reviews} = hooks.useReviewOrder()

  useEffect(()=>{
    getReviewAndRating()
  },[])

  useEffect(() => {
    // Ensure this runs only on the client where window is defined
    if (typeof window !== 'undefined' && reviews && reviews.length > 0) {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#review-')) {
        const elementId = hash.substring(1); // Remove the '#'
        // Basic debouncing/delay to allow DOM to update if reviews just loaded
        const timer = setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100); // Adjust delay as needed
        return () => clearTimeout(timer);
      }
    }
  }, [reviews]); // Re-run if reviews data changes. Hash is read fresh each time.
  

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Reviews'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 20}}
      >
        <ul>
          {reviews?.map((review, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <items.ReviewItem
                key={review.id}
                review={review}
                truncateText={true}     // Initially truncate
                maxLines={3}            // Show 3 lines on reviews page
                showMoreButton={true}   // Show "more" button for expansion
                showViewButton={false}  // No "View" button here
                // No onCardClick, so card itself isn't navigational
                containerStyle={{marginBottom: isLast ? 0 : 14}}
              />
            );
          })}
        </ul>
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
