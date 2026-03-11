import React from 'react';

type Props = {price:number,quantity:number};

export const DishPrice: React.FC<Props> = ({price,quantity}) => {
  return (
    <div style={{gap: 7, display: 'flex', alignItems: 'center'}}>
      <span
        className='t14'
        style={{fontWeight: 500, color: 'var(--main-dark)'}}
      >
        ₹{price}
      </span>
      <div style={{width: 1, height: 10, backgroundColor: '#D5DCE3'}} />
      <span className='t14'>Stocks : {quantity}</span>
    </div>
  );
};
