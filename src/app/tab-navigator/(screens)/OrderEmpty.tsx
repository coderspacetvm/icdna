import React from 'react';
import Image from 'next/image';

import { URLS } from '../../../config';
import { Routes, TabScreens } from '../../../routes';
import { components } from '../../../components';

export const OrderEmpty: React.FC = React.memo(() => {

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        showBasket={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        <section
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            placeItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'var(--white-color)',
          }}
        >
          <Image
            src={`${URLS.MAIN_URL}/assets/images/02.jpg`}
            alt='profile'
            width={290}
            height={290}
            style={{
              maxWidth: 290,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 14,
            }}
          />
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 14,
              textTransform: 'capitalize',
            }}
          >
            Your cart is empty!
          </h2>
          <p
            style={{ textAlign: 'center' }}
            className='t16'
          >
            Looks like you haven't made <br />
            your order yet.
          </p>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{ padding: '10px 20px 0 20px' }}>
        <components.Button
          href={`${Routes.TAB_NAVIGATOR}?screen=${TabScreens.MENU}`}
          label='Shop now'
        />
      </section>
    );
  };

  const renderModal = () => {
    return <components.Modal />;
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
      {renderModal()}
      {renderBottomTabBar()}
    </components.Screen>
  );
});
