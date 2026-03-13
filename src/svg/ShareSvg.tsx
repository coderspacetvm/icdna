import React from 'react';

export const ShareSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path 
        d="M21 11L14 4V8C7 9 4 14 3 19C5.5 15.5 9 13.9 14 13.9V18L21 11Z" 
        fill="var(--main-turquoise)"
        stroke="none"
      />
    </svg>
  );
};
