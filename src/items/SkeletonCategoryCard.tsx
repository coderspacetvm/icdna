import React from 'react';

export const SkeletonCategoryCard: React.FC = () => {
  return (
    <div
      style={{
        minWidth: '120px', // Matches original SwiperSlide style
        width: '120px',    // Matches original Link style width
        height: '120px',   // Matches original Link style height
        borderRadius: 10,
        backgroundColor: 'var(--white-color, #ffffff)', // Match card background
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)', // Match card shadow
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        marginRight: '10px', // Mimics Swiper spaceBetween={10}
      }}
      aria-hidden="true"
    >
      {/* Skeleton Image part */}
      <div
        style={{
          width: '100%',
          height: '80px', // Slightly less than original 100px image to leave space for text block
          backgroundColor: '#e0e0e0', // Placeholder color
        }}
      />
      {/* Skeleton Text part */}
      <div
        style={{
          padding: '6px 0',
          textAlign: 'center',
          backgroundColor: 'rgba(240, 240, 240, 0.9)', // Lighter placeholder for text background
          borderTop: '1px solid rgba(220, 220, 220, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <div
          style={{
            width: '70%',
            height: '14px', // Approx height of text
            backgroundColor: '#d0d0d0', // Darker placeholder for text line
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
};
