import React from 'react';
import Image from 'next/image';

import {URLS} from '../../../config';
import {components} from '../../../components';

export const WishListEmpty: React.FC = React.memo(() => {
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
        style={{paddingTop: 10, paddingBottom: 10}}
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
            src={`${URLS.MAIN_URL}/assets/images/01.jpg`}
            alt='profile'
            width={290}
            height={290}
            priority={true}
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
            Your favorite list <br /> is empty!
          </h2>
          <p
            style={{textAlign: 'center'}}
            className='t16'
          >
            Your list of favorite dishes is currently <br /> empty. Why not
            start adding dishes <br /> that you love?
          </p>
        </section>
      </main>
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
      {renderModal()}
      {renderBottomTabBar()}
    </components.Screen>
  );
});
