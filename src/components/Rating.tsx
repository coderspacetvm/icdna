import * as React from 'react';

type Props = {
  rating: number;
};

export const Rating: React.FC<Props> = ({rating}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={58}
      height={10}
      fill='none'
    >
      <g>
        <path
          fill={rating >= 1 ? '#FFCA40' : '#fff'}
          stroke='#FFCA40'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m5 .833 1.288 2.609 2.879.42-2.084 2.03.492 2.866L5 7.404 2.425 8.758l.492-2.866-2.084-2.03 2.88-.42L5 .833Z'
        />
      </g>
      <g clipPath='url(#b)'>
        <path
          fill={rating >= 2 ? '#FFCA40' : '#fff'}
          stroke='#FFCA40'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m17 .833 1.288 2.609 2.879.42-2.084 2.03.492 2.866L17 7.404l-2.575 1.354.492-2.866-2.084-2.03 2.88-.42L17 .833Z'
        />
      </g>
      <g clipPath='url(#c)'>
        <path
          fill={rating >= 3 ? '#FFCA40' : '#fff'}
          stroke='#FFCA40'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m29 .833 1.288 2.609 2.879.42-2.084 2.03.492 2.866L29 7.404l-2.575 1.354.492-2.866-2.084-2.03 2.88-.42L29 .833Z'
        />
      </g>
      <g clipPath='url(#d)'>
        <path
          fill={rating >= 4 ? '#FFCA40' : '#fff'}
          stroke='#FFCA40'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m41 .833 1.288 2.609 2.879.42-2.084 2.03.492 2.866L41 7.404l-2.575 1.354.492-2.866-2.084-2.03 2.88-.42L41 .833Z'
        />
      </g>
      <g clipPath='url(#e)'>
        <path
          fill={rating >= 5 ? '#FFCA40' : '#fff'}
          stroke='#FFCA40'
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m53 .833 1.288 2.609 2.879.42-2.084 2.03.492 2.866L53 7.404l-2.575 1.354.492-2.866-2.084-2.03 2.88-.42L53 .833Z'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M0 0h10v10H0z'
          />
        </clipPath>
        <clipPath id='b'>
          <path
            fill='#fff'
            d='M12 0h10v10H12z'
          />
        </clipPath>
        <clipPath id='c'>
          <path
            fill='#fff'
            d='M24 0h10v10H24z'
          />
        </clipPath>
        <clipPath id='d'>
          <path
            fill='#fff'
            d='M36 0h10v10H36z'
          />
        </clipPath>
        <clipPath id='e'>
          <path
            fill='#fff'
            d='M48 0h10v10H48z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
