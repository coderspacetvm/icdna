import React from 'react';

import {svg} from '../svg';
import type {PromocodeType} from '../types';

type Props = {
  isLast: boolean;
  promocode: PromocodeType;
};

export const PromocodeItem: React.FC<Props> = ({isLast, promocode}) => {
  const colors = (): string => {
    if (promocode.discount <= 10) {
      return '#06402B';
    }

    if (promocode.discount <= 35) {
      return '#FFA462';
    }

    if (promocode.discount <= 100) {
      return '#FA5555';
    }

    return '#FA5555';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert(`${promocode.code} code copied to clipboard`);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      },
    );
  };

  return (
    <li
      style={{
        padding: 20,
        borderRadius: 10,
        marginBottom: isLast ? 0 : 14,
        backgroundColor: 'var(--white-color)',
      }}
      className='clickable'
      onClick={() => {
        copyToClipboard(promocode.code);
      }}
    >
      <section
        style={{
          marginBottom: 7,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3>{promocode.code}</h3>
        <svg.CopySvg />
      </section>
      <section
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: colors(),
            borderRadius: 5,
            padding: '3px 8px',
          }}
        >
          <span
            className='t12'
            style={{color: 'var(--white-color)', fontWeight: 500}}
          >
            {promocode.discount}% discount
          </span>
        </div>
        <span className='t12'>Expire {promocode.expiry}</span>
      </section>
    </li>
  );
};
