'use client';

import React from 'react';

import {items} from '../../../items';
import {stores} from '../../../stores';
import {components} from '../../../components';
// import { ProductType } from '@/types/DishType';
// import { hooks } from '@/hooks';

export const Wishlist: React.FC = React.memo(() => {
  const {list: wishlist} = stores.useWishlistStore();

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        showBasket={true}
        title='Favorite'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 20}}
      >
        <ul
          style={{
            display: 'grid',
            gap: 15,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {wishlist.map((item) => (
            <items.ItemGrid item={item.product} key={item.product.id} />
          ))}
        </ul>
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
