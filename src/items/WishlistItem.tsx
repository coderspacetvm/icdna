import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { dish } from '../dish';

import { svg } from '../svg';
// import {stores} from '../stores';
import { Routes } from '../routes';
import itemPlaceholder from './../../public/mock/images/item-placeholder.png'

import { ProductType } from '@/types/DishType';
import { hooks } from '@/hooks';
import { stores } from '@/stores';
import { showCartAddedToast } from '@/components/CartToast';

type Props = {
  item: ProductType;
};

export const WishlistItem: React.FC<Props> = ({ item }) => {
  const { toggleWishlistItem } = stores.useWishlistStore();
  const { addToCart } = hooks.useManageCart();
  const [isCartLoading, setIsCartLoading] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);

  const firstVariant = Array.isArray(item.variants) ? item.variants[0] : item.variants;
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);

  return (
    <li style={{ backgroundColor: 'var(--white-color)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
      <Link
        href={`${Routes.MENU_ITEM}/${item.id}`}
        onClick={() => setIsNavigating(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          animation: isNavigating ? 'pulse-animation 1s infinite ease-in-out' : 'none'
        }}
      >
        <div style={{ width: '100%', height: '160px', position: 'relative', overflow: 'hidden' }}>
          <Image
            src={firstVariant?.additional_images?.[0] || itemPlaceholder}
            alt={'dish'}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <button
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--page-background-color, #f0f0f0)',
            zIndex: 1,
            cursor: 'pointer'
          }}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsWishlistLoading(true);
            await toggleWishlistItem(item.id, firstVariant.id);
            setIsWishlistLoading(false);
          }}
          disabled={isWishlistLoading}
        >
          <div style={isWishlistLoading ? { animation: 'pulse-animation 1s infinite ease-in-out' } : {}}>
            <svg.HeartSvg flag={item.id ? true : false} />
          </div>
        </button>

        <div style={{ padding: 14, paddingTop: 0 }}>
          <div style={{ marginRight: 14 }}>
            <dish.DishName name={item.name} style={{ marginBottom: 3 }} />
          </div>
          <dish.DishPrice price={firstVariant.sale_price} quantity={firstVariant.quantity} />
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              // Check if variant is out of stock before attempting to add
              if (firstVariant.quantity === 0) {
                console.log('Cannot add to cart: Item is out of stock');
                return;
              }
              try {
                setIsCartLoading(true);
                const success = await addToCart(item.id, firstVariant.id);
                if (success) {
                  showCartAddedToast({ hasItemsOverride: true });
                }
              } catch (error) {
                console.error('Error adding to cart:', error);
              } finally {
                setIsCartLoading(false);
              }
            }}
            className=""
            style={{
              position: 'absolute',
              padding: 14,
              right: 0,
              bottom: 0,
              borderRadius: 10,
              background: 'white',
              color: '#0C1D2E',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
      </Link>
    </li>
  );
};

