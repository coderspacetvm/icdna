import * as React from 'react';

export const GiftSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      fill='none'
    >
      <rect
        width={24}
        height={24}
        fill='#FA5555'
        rx={12}
      />
      <g
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path d='M17.333 12v6.667H6.667V12M18.667 8.667H5.333V12h13.334V8.667ZM12 18.667v-10M12 8.667H9a1.667 1.667 0 0 1 0-3.334c2.333 0 3 3.334 3 3.334ZM12 8.667h3a1.667 1.667 0 1 0 0-3.334c-2.333 0-3 3.334-3 3.334Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M4 4h16v16H4z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
