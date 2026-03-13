import React from 'react';

type Prop = {
  flag : boolean | null;
  isLoading?: boolean;
}

export const HeartSvg: React.FC<Prop> = ({flag, isLoading}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill='none'
    >
      {isLoading ? (
        <g style={{ transformOrigin: 'center' }}>
          <circle cx="8" cy="8" r="7" stroke="var(--accent-color, #FA5555)" strokeWidth="2" strokeOpacity="0.2" />
          <path
            d="M8 1 a 7 7 0 0 1 7 7"
            stroke="var(--accent-color, #FA5555)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 8 8"
              to="360 8 8"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      ) : (
        <path
          fill={flag ? '#FA5555' : 'transparent'}
          stroke={flag ? '#FA5555' : 'var(--text-color)'}
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M13.893 3.073a3.667 3.667 0 0 0-5.186 0L8 3.78l-.707-.707A3.668 3.668 0 0 0 2.107 8.26l.706.707L8 14.153l5.187-5.186.706-.707a3.667 3.667 0 0 0 0-5.187v0Z'
        />
      )}
    </svg>
  );
};
