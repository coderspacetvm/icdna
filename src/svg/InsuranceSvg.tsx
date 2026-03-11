import React from 'react';

export const InsuranceSvg: React.FC = () => {
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
        fill='#FFF7F2'
        rx={20}
      />
      <g>
        <mask
          id='b'
          width={24}
          height={24}
          x={8}
          y={8}
          maskUnits='userSpaceOnUse'
          style={{
            maskType: 'luminance',
          }}
        >
          <path
            fill='#fff'
            d='M8 8h24v24H8V8Z'
          />
        </mask>
        <g
          stroke='#040325'
          strokeMiterlimit={10}
          mask='url(#b)'
        >
          <path d='M20 8v2.11M20 21.406v8.485a1.406 1.406 0 1 0 2.813 0v-1.407M31.297 20.703S29.844 20 28.437 20c-1.406 0-2.812 1.406-2.812 1.406S24.219 20 22.812 20C21.407 20 20 21.406 20 21.406S18.594 20 17.187 20c-1.406 0-2.812 1.406-2.812 1.406S12.969 20 11.562 20c-1.406 0-2.859.703-2.859.703 0-6.215 5.081-10.594 11.297-10.594s11.297 4.379 11.297 10.594Z' />
          <path d='M14.375 21.406c0-5.825 2.518-11.297 5.625-11.297s5.625 5.472 5.625 11.297M20 10.11v11.296' />
        </g>
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M8 8h24v24H8z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
