import React, { useState } from 'react'; // Added back useState
import Image from 'next/image';
import user_ph from '../../public/mock/images/user_placeholder.jpg';

import { components } from '../components';
import { ReviewType } from '../types';
import { formatDateTime } from '@/utility/utils';

// Props type for ReviewItem component
type Props = {
  review: ReviewType;
  containerStyle?: React.CSSProperties;
  truncateText?: boolean;
  maxLines?: number; // New prop to control number of lines
  onCardClick?: () => void; // For navigation, used by "View" button
  showMoreButton?: boolean;
  showViewButton?: boolean;
};

export const ReviewItem: React.FC<Props> = ({
  review,
  containerStyle,
  truncateText = false,
  maxLines = 1, // Default to 1 line
  onCardClick, // This is for the "View" button's action
  showMoreButton = false,
  showViewButton = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Re-added state

  const profilePicture =
    review.user?.profile_picture?.endsWith('.svg') || !review.user?.profile_picture
      ? user_ph
      : review.user?.profile_picture;
  const reviewDate = review.created_at;

  // Determine if text needs expansion control
  // For "more" button: use heuristic for long text
  const needsMoreButton = review.review?.split('\n').length > 3 || (review.review?.length ?? 0) > 120;
  
  // For "View" button: show only when text is actually being truncated
  // Estimate if text would exceed the maxLines limit (rough calculation)
  const estimatedLines = review.review ? Math.ceil(review.review.length / 50) : 0; // Rough estimate: ~50 chars per line
  const hasLineBreaks = review.review?.includes('\n') || false;
  const wouldBeTruncated = estimatedLines > maxLines || hasLineBreaks;
  const needsViewButton = showViewButton && truncateText && review.review && wouldBeTruncated;

  const reviewTextStyle: React.CSSProperties =
    truncateText && !isExpanded
      ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.4em',
          maxHeight: `${maxLines * 1.4}em`, // Dynamic height based on maxLines
          // Add paddingRight if a button will be shown, to make space for it
          paddingRight: (showMoreButton && needsMoreButton) || (showViewButton && needsViewButton) ? '50px' : '0px', // Approx width of button + some space
        }
      : {
          lineHeight: '1.4em',
          // No paddingRight needed if text is not clamped or no button is shown
        };

  const cardId = `review-${review.id}`;

  const finalContainerStyle: React.CSSProperties = {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'var(--white-color)',
    // Ensure consistent height for all cards, especially on smaller screens
    minHeight: '140px', // Fixed height for consistency
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...containerStyle,
  };
  
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if "more" is inside a clickable card area
    setIsExpanded(true);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any other potential parent clicks
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <li
      id={cardId}
      style={finalContainerStyle}
      // onClick logic for the whole card is removed for now, assuming specific buttons handle actions.
      // If home card itself should be clickable, onCardClick (for nav) would be here, gated by !showMoreButton && !showViewButton or similar logic.
    >
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 10,
          marginBottom: 10,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Image
          src={profilePicture}
          width={0}
          height={0}
          sizes='100vw'
          alt={review.user?.name || 'user_profile'}
          style={{ width: 30, height: 30, borderRadius: 15, marginRight: 14 }}
        />
        <div style={{ width: '100%' }}>
          <div
            style={{
              marginBottom: 4,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '4px',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h5 
                className="reviewer-name"
                style={{ 
                  lineHeight: 1.2,
                  fontSize: '14px',
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {review.user?.name}
              </h5>
              {reviewDate && (
                <span 
                  className='t10 review-date-mobile' 
                  style={{ 
                    lineHeight: 1.2,
                    display: 'none',
                    marginTop: '2px',
                  }}
                >
                  {formatDateTime(reviewDate)}
                </span>
              )}
            </div>
            {reviewDate && (
              <span 
                className='t10 review-date-desktop' 
                style={{ 
                  lineHeight: 1.2,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {formatDateTime(reviewDate)}
              </span>
            )}
          </div>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <components.Rating rating={review.average_rating} />
          </div>
        </div>
      </section>
      {/* This section now has position: relative */}
      <section style={{ position: 'relative', minHeight: '1.4em' /* Reduced height for single line */ }}>
        <p className='t14' style={reviewTextStyle}>
          {review.review}
        </p>
        {truncateText && !isExpanded && needsMoreButton && showMoreButton && (
          <button
            className='t14'
            onClick={handleMoreClick}
            style={{
              position: 'absolute',
              bottom: '0px', 
              right: '0px',  
              background: 'var(--white-color)', // Match card background
              border: 'none',
              color: 'var(--main-turquoise)',
              cursor: 'pointer',
              padding: '0px 5px', // Minimal padding for the button itself
              // fontSize: 'inherit',
              fontWeight: 'bold',
              lineHeight: '1.4em', // Match text line height
            }}
          >
            more
          </button>
        )}
        {needsViewButton && !isExpanded && (
          <button
            className='t14'
            onClick={handleViewClick}
            style={{
              position: 'absolute',
              bottom: '0px', // Align to the bottom of the section
              right: '0px',  // Align to the right of the section
              background: 'var(--white-color)', // Match card background
              border: 'none',
              color: 'var(--main-turquoise)',
              cursor: 'pointer',
              padding: '0px 5px', // Minimal padding for the button itself
              // fontSize: 'inherit',
              fontWeight: 'bold',
              lineHeight: '1.4em', // Match text line height
            }}
          >
            View
          </button>
        )}
      </section>
    </li>
  );
};
