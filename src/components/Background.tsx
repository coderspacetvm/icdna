import React from 'react';

import Image from 'next/image';

export const Background: React.FC = () => {
  return (
    <Image
      src={'/assets/01.png'}
      width={0}
      height={0}
      alt='background'
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
      }}
    />
  );
};
