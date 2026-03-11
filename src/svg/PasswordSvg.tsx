import React from 'react';

export const PasswordSvg: React.FC = () => {
  return (
    <div style={{width: 34, height: 34}}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={34}
        height={34}
        fill='none'
      >
        <rect
          width={34}
          height={34}
          fill='#FFD9C3'
          rx={6}
        />
        <path
          stroke='#FF8A71'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.2}
          d='m23 10.333-1.333 1.334m0 0 2 2L21.333 16l-2-2m2.334-2.333L19.333 14m-2.74 2.74a3.665 3.665 0 0 1-1.178 6 3.665 3.665 0 0 1-4.007-.815 3.666 3.666 0 0 1 5.185-5.184v-.001Zm0 0 2.74-2.74'
        />
      </svg>
    </div>
  );
};
