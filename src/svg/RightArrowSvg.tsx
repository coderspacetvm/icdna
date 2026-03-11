import React from 'react';

export const RightArrowSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={6}
      height={11}
      fill='none'
    >
      <g>
        <path
          stroke='#6C6D84'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M.857 9.786 5.143 5.5.857 1.214'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M6 0H0v11h6z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
