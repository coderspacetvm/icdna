import React from 'react';

type Props = {
  containerStyle?: object;
  setRating: (value: number) => void;
  rating: number;
};

export const RatingStars: React.FC<Props> = ({
  containerStyle,
  setRating,
  rating,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        ...containerStyle,
      }}
    >
      <button
        onClick={() => {
          setRating(1);
          setRating(rating === 1 ? 0 : 1);
        }}
        style={{marginRight: 4, borderRadius: 20}}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={40}
          height={40}
          fill='none'
        >
          <path
            fill={rating >= 1 ? '#F5C102' : '#E9F3F6'}
            stroke={rating >= 1 ? '#F5C102' : '#E9F3F6'}
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m20 4.463 4.702 9.525a.5.5 0 0 0 .376.273l10.514 1.537-7.608 7.41a.5.5 0 0 0-.144.443l1.796 10.468-9.403-4.945a.5.5 0 0 0-.466 0l-9.403 4.945 1.795-10.468a.5.5 0 0 0-.144-.442l-7.608-7.41 10.515-1.538a.5.5 0 0 0 .376-.273L20 4.463Z'
          />
        </svg>
      </button>
      <button
        onClick={() => setRating(2)}
        style={{marginRight: 4, borderRadius: 20}}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={40}
          height={40}
          fill='none'
        >
          <path
            fill={rating >= 2 ? '#F5C102' : '#E9F3F6'}
            stroke={rating >= 2 ? '#F5C102' : '#E9F3F6'}
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m20 4.463 4.702 9.525a.5.5 0 0 0 .376.273l10.514 1.537-7.608 7.41a.5.5 0 0 0-.144.443l1.796 10.468-9.403-4.945a.5.5 0 0 0-.466 0l-9.403 4.945 1.795-10.468a.5.5 0 0 0-.144-.442l-7.608-7.41 10.515-1.538a.5.5 0 0 0 .376-.273L20 4.463Z'
          />
        </svg>
      </button>
      <button
        onClick={() => setRating(3)}
        style={{marginRight: 4, borderRadius: 20}}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={40}
          height={40}
          fill='none'
        >
          <path
            fill={rating >= 3 ? '#F5C102' : '#E9F3F6'}
            stroke={rating >= 3 ? '#F5C102' : '#E9F3F6'}
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m20 4.463 4.702 9.525a.5.5 0 0 0 .376.273l10.514 1.537-7.608 7.41a.5.5 0 0 0-.144.443l1.796 10.468-9.403-4.945a.5.5 0 0 0-.466 0l-9.403 4.945 1.795-10.468a.5.5 0 0 0-.144-.442l-7.608-7.41 10.515-1.538a.5.5 0 0 0 .376-.273L20 4.463Z'
          />
        </svg>
      </button>
      <button
        onClick={() => setRating(4)}
        style={{marginRight: 4, borderRadius: 20}}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={40}
          height={40}
          fill='none'
        >
          <path
            fill={rating >= 4 ? '#F5C102' : '#E9F3F6'}
            stroke={rating >= 4 ? '#F5C102' : '#E9F3F6'}
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m20 4.463 4.702 9.525a.5.5 0 0 0 .376.273l10.514 1.537-7.608 7.41a.5.5 0 0 0-.144.443l1.796 10.468-9.403-4.945a.5.5 0 0 0-.466 0l-9.403 4.945 1.795-10.468a.5.5 0 0 0-.144-.442l-7.608-7.41 10.515-1.538a.5.5 0 0 0 .376-.273L20 4.463Z'
          />
        </svg>
      </button>
      <button
        onClick={() => setRating(5)}
        style={{borderRadius: 20}}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={40}
          height={40}
          fill='none'
        >
          <path
            fill={rating >= 5 ? '#F5C102' : '#E9F3F6'}
            stroke={rating >= 5 ? '#F5C102' : '#E9F3F6'}
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m20 4.463 4.702 9.525a.5.5 0 0 0 .376.273l10.514 1.537-7.608 7.41a.5.5 0 0 0-.144.443l1.796 10.468-9.403-4.945a.5.5 0 0 0-.466 0l-9.403 4.945 1.795-10.468a.5.5 0 0 0-.144-.442l-7.608-7.41 10.515-1.538a.5.5 0 0 0 .376-.273L20 4.463Z'
          />
        </svg>
      </button>
    </div>
  );
};
