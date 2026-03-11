import React from 'react';

type Prop = {
  flag : boolean | null
}

export const HeartSvg: React.FC<Prop> = ({flag}) => {

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={16}
      height={16}
      fill='none'
    >
      <path
        fill={flag ? '#FA5555' : 'transparent'}
        stroke={flag ? '#FA5555' : 'var(--text-color)'}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M13.893 3.073a3.667 3.667 0 0 0-5.186 0L8 3.78l-.707-.707A3.668 3.668 0 0 0 2.107 8.26l.706.707L8 14.153l5.187-5.186.706-.707a3.667 3.667 0 0 0 0-5.187v0Z'
      />
    </svg>
  );
};
