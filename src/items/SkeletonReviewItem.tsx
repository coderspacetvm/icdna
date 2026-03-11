import React from 'react';

type Props = {
  containerStyle?: React.CSSProperties;
};

export const SkeletonReviewItem: React.FC<Props> = ({ containerStyle }) => {
  const placeholderColor = '#e0e0e0';
  const lighterPlaceholderColor = '#f0f0f0';

  return (
    <li
      style={{
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'var(--white-color)',
        border: '1px solid var(--border-color, #eee)', // Added border for visibility during loading
        minWidth: '280px', // Approximate width of a review item in a carousel
        marginRight: '14px', // Mimics Swiper spaceBetween={14}
        ...containerStyle,
      }}
      aria-hidden="true"
    >
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 10,
          marginBottom: 10,
          borderBottom: '1px solid var(--border-color, #eee)',
        }}
      >
        {/* Avatar Placeholder */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: placeholderColor,
            marginRight: 14,
          }}
        />
        <div style={{ width: '100%' }}>
          {/* Name and Date Placeholder */}
          <div
            style={{
              marginBottom: 8, // Increased margin slightly
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ height: 16, width: '50%', backgroundColor: placeholderColor, borderRadius: '4px' }} /> {/* Name */}
            <div style={{ height: 12, width: '30%', backgroundColor: placeholderColor, borderRadius: '4px' }} /> {/* Date */}
          </div>
          {/* Rating and Reply Placeholder */}
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ height: 14, width: '40%', backgroundColor: placeholderColor, borderRadius: '4px' }} /> {/* Rating */}
            <div style={{ height: 12, width: '20%', backgroundColor: placeholderColor, borderRadius: '4px' }} /> {/* Reply */}
          </div>
        </div>
      </section>
      {/* Comment Placeholder */}
      <section>
        <div style={{ height: 14, width: '100%', backgroundColor: lighterPlaceholderColor, borderRadius: '4px', marginBottom: 6 }} />
        <div style={{ height: 14, width: '80%', backgroundColor: lighterPlaceholderColor, borderRadius: '4px' }} />
      </section>
    </li>
  );
};
