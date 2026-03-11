import React from 'react';

export const SkeletonCarouselItem: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '200px', // Approximate height, can be adjusted based on actual carousel item height
        backgroundColor: '#e0e0e0', // Consistent placeholder color
        borderRadius: '10px', // Optional: if carousel items are rounded
        margin: '0 auto', // Center it if there's any horizontal padding in the parent Swiper
      }}
      aria-hidden="true"
    />
  );
};

// Also, ensure this new component is exported from src/items/index.tsx if that's the project pattern.
// For now, assuming direct import in Home.tsx or this will be handled later if needed.
