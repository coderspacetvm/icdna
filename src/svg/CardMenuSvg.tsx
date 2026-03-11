import React from 'react';

export const CardMenuSvg: React.FC = () => {
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
      <g
        stroke='#040325'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path d='M26 14.667H14c-.736 0-1.333.597-1.333 1.333v8c0 .736.597 1.333 1.333 1.333h12c.736 0 1.333-.597 1.333-1.333v-8c0-.736-.597-1.333-1.333-1.333ZM12.667 18.667h14.666' />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M12 12h16v16H12z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
