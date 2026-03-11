import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { dish } from '../dish';

import { svg } from '../svg';
import { stores } from '../stores';
import { Routes } from '../routes';

import { ProductType } from '@/types/DishType';
import { hooks } from '@/hooks';
import { showCartAddedToast } from '@/components/CartToast';

type Props = {
  item: ProductType;
};

export const RecommendedItem: React.FC<Props> = ({ item }) => {
  // const {addToCart} = stores.useCartStore();
  const { updateWishlistWithItem } = hooks.useManageWishList()
  const { addToCart } = hooks.useManageCart()
  const [isCartLoading, setIsCartLoading] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);


  const {
    // list: wishlist,
    // addToWishlist,
  } = stores.useWishlistStore();

  // const dishId = item.id;

  // const ifInWishlist = wishlist.find((item) => item.id === dishId);

  return (
    <Link
      className='column clickable'
      href={`${Routes.MENU_ITEM}/${item.id}`}
      onClick={() => setIsNavigating(true)}
      style={{
        backgroundColor: 'var(--white-color)',
        borderRadius: '10px',
        position: 'relative',
        animation: isNavigating ? 'pulse-animation 1s infinite ease-in-out' : 'none'
      }}
    >
      <Image
        src={item.image}
        alt='Dish'
        width={0}
        height={0}
        sizes='100vw'
        priority={true}
        style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
      />
      <button
        style={{
          position: 'absolute',
          right: 0,
          bottom: 72 - 15,
          padding: 15,
          borderRadius: 10,
        }}
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsWishlistLoading(true);
          await updateWishlistWithItem(item.id, item.variants[0].id)
          setIsWishlistLoading(false);
        }}
        disabled={isWishlistLoading}
      >
        <div style={isWishlistLoading ? { animation: 'pulse-animation 1s infinite ease-in-out' } : {}}>
          <svg.HeartSvg flag={item.variants[0].is_favorite} />
        </div>
      </button>
      <div
        className='column'
        style={{ padding: '14px' }}
      >
        <dish.DishName
          name={item.name}
          style={{ marginBottom: 3 }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <dish.DishPrice price={item.variants[0].sale_price} quantity={item.variants[0].quantity} />
          <button
            className=""
            style={{
              position: 'absolute',
              padding: '14px',
              right: 0,
              bottom: 0,
              background: 'white',
              color: '#0C1D2E',
              borderRadius: '10px 0 10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E5E7EB'
            }}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              // Check if variant is out of stock before attempting to add
              if (item.variants[0].quantity === 0) {
                console.log('Cannot add to cart: Item is out of stock');
                return;
              }
              try {
                setIsCartLoading(true);
                const success = await addToCart(item.id, item.variants[0].id);
                if (success) {
                  showCartAddedToast({ hasItemsOverride: true });
                }
              } catch (error) {
                console.error('Error adding to cart:', error);
              } finally {
                setIsCartLoading(false);
              }
            }}
          >
            {isCartLoading ? (
              <div style={{ animation: 'pulse-animation 1s infinite ease-in-out' }}>
                <svg.PlusSvg stroke="#0C1D2E" />
              </div>
            ) : (
              <svg.PlusSvg stroke="#0C1D2E" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};
