import React from 'react';

type Props = {fillColor: string; strokeColor: string};

export const HomeTabSvg: React.FC<Props> = ({fillColor, strokeColor}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      fill='none'
    >
      <path
        fill={fillColor}
        fillOpacity={0.15}
        d='M5.4 7.87 12 2.4l6.6 5.47V21H5.4V7.87Z'
      />
      <path
        stroke={strokeColor}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M5 21h14M5 21V8m14 13V8M2 10l10-8 10 8'
      />
    </svg>
  );
};
