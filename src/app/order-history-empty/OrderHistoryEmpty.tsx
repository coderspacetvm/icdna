'use client';

import React from 'react';
import Image from 'next/image';

import { URLS } from '../../config';
import { Routes, TabScreens } from '../../routes';
import { components } from '../../components';
import { hooks } from '../../hooks';

export const OrderHistoryEmpty: React.FC = () => {
  const router = hooks.useTrackedRouter();

  const handleBack = () => {
    // Go directly to Home tab — avoids the redirect loop with order-history
    router.push(`${Routes.TAB_NAVIGATOR}?screen=${TabScreens.HOME}`);
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Order history'
        onGoBack={handleBack}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{ paddingTop: 10 }}
      >
        <section
          style={{
            height: '100%',
            borderRadius: 10,
            backgroundColor: 'var(--white-color)',
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className='center'
        >
          <Image
            src={`${URLS.MAIN_URL}/assets/images/10.jpg`}
            alt='Account created'
            width={0}
            height={0}
            sizes='100vw'
            priority={true}
            style={{ marginBottom: '10%', width: '70%', height: 'auto' }}
          />
          <h2 style={{ marginBottom: 14 }}>No Order History Yet!</h2>
          <p
            className='t16'
            style={{ textAlign: 'center' }}
          >
            It looks like your order history is empty. <br /> Place your order
            now to start building <br /> your history!
          </p>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{ padding: 20 }}>
        <components.Button
          label='Explore Our Menu'
          href={`${Routes.MENU_LIST}/all`}
        />
      </section>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </components.Screen>
  );
};
