'use client';

import React from 'react';
import Image from 'next/image';

import {URLS} from '../../config';
import {components} from '../../components';

export const PromocodesEmpty: React.FC = () => {
  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Promocodes & gift cards'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10}}
      >
        <section
          style={{
            borderRadius: 10,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--white-color)',
          }}
        >
          <Image
            src={`${URLS.MAIN_URL}/assets/images/04.jpg`}
            alt='Account created'
            width={0}
            height={0}
            sizes='100vw'
            priority={true}
            style={{marginBottom: '10%', width: '70%', height: 'auto'}}
          />
          <h2
            style={{
              textAlign: 'center',
              textTransform: 'capitalize',
              marginBottom: 14,
            }}
          >
            You don’t have <br />
            promocodes yet!
          </h2>
          <p
            className='t16'
            style={{textAlign: 'center', marginBottom: 30}}
          >
            Stay tuned for and discounts to <br /> enhance your dining
            experience.
          </p>
          <div style={{width: '100%'}}>
            <components.InputField
              type='text'
              inputType='promocode'
              placeholder='Enter promocode'
              containerStyle={{marginBottom: 20}}
            />
            <components.Button
              label='add promocode'
              containerStyle={{marginBottom: 20}}
              onClick={() => {}}
            />
          </div>
        </section>
      </main>
    );
  };

  const renderIndent = () => {
    return <div style={{height: 20}} />;
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderIndent()}
    </components.Screen>
  );
};
