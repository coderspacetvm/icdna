import React from 'react';

export const PlusSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={21}
      height={21}
      fill='none'
      {...props}
    >
      <rect
        width={21}
        height={21}
        fill={props.fill || '#E6F3F8'}
        rx={10.5}
      />
      <path
        stroke={props.stroke || '#0C1D2E'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M10.5 6.125v8.75M6.125 10.5h8.75'
      />
    </svg>
  );
};
