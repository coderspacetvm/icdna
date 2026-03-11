import React from 'react';

export const FIleTextSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={40}
      height={40}
      fill='none'
    >
      <rect
        width={40}
        height={40}
        fill='#fff'
        rx={20}
      />
      <path
        stroke='#040325'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M21.333 13.333H16a1.333 1.333 0 0 0-1.333 1.334v10.666A1.333 1.333 0 0 0 16 26.667h8a1.334 1.334 0 0 0 1.333-1.334v-8l-4-4Z'
      />
      <path
        stroke='#040325'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M21.333 13.333v4h4M22.667 20.667h-5.334M22.667 23.333h-5.334M18.667 18h-1.334'
      />
    </svg>
  );
};
