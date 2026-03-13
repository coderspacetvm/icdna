import React from 'react';

export const DeliverySvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill='none'
      stroke='white'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
};
