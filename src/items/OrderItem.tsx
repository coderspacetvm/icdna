import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Routes } from '../routes';
import { stores } from '../stores';
import { dish as dishItem } from '../dish';

import itemPlaceholder from './../../public/mock/images/item-placeholder.png'


// import type {DishType} from '../types';
import { CartItem } from '@/types/CartDataType';

type Props = { dish: CartItem; isLast: boolean };

export const MinusSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={21}
      height={21}
      fill='none'
    >
      <rect
        width={21}
        height={21}
        fill='#E6F3F8'
        rx={10.5}
      />
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M6.125 10.5h8.75'
      />
    </svg>
  );
};

export const PlusSvg: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={21}
      height={21}
      fill='none'
      style={{ ...style }}
    >
      <rect
        width={21}
        height={21}
        fill='#E6F3F8'
        rx={10.5}
      />
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M10.5 6.125v8.75M6.125 10.5h8.75'
      />
    </svg>
  );
};

// Create an X icon for the clear button
export const XIconSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={14}
      height={14}
      fill='none'
      viewBox='0 0 24 24'
    >
      <path
        // stroke='#DC2626'
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M18 6L6 18M6 6l12 12'
      />
    </svg>
  );
};

export const OrderItem: React.FC<Props> = ({ dish, isLast }) => {
  const { addToCart, removeFromCart, clearItemFromCart } = stores.useCartStore();
  const [isClearLoading, setIsClearLoading] = React.useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = React.useState(false);
  const [isAddLoading, setIsAddLoading] = React.useState(false);
  const isAnyLoading = isClearLoading || isRemoveLoading || isAddLoading;

  // Check if this item's quantity exceeds available stock
  const actualVariant = dish.product.variants.find(
    (variant) => variant.id === dish.variant.id
  );

  const isQuantityExceeded = actualVariant ? dish.quantity > actualVariant.quantity : false;
  const availableQuantity = actualVariant?.quantity || 0;
  const isOutOfStock = availableQuantity === 0;

  // Check for API error (out of stock)
  // const errorKey = `${dish.product.id}_${dish.variant.id}`;
  // const apiError = outOfStockErrors[errorKey];

  // Show error if out of stock or quantity exceeded
  const hasError = isOutOfStock || isQuantityExceeded;
  // const errorMessage = isOutOfStock ? 'Out of stock' : (isQuantityExceeded ? `Only ${availableQuantity} available` : '');

  return (
    <li>
      <div
        style={{
          position: 'relative',
          marginBottom: isLast ? 0 : 14,
          opacity: isAnyLoading ? 0.75 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* X (Clear) button with spinner */}
        <button
          style={{
            position: 'absolute',
            top: '4px',
            left: '8px',
            zIndex: 20,
            background: isClearLoading ? '#ef4444' : '#DC2626',
            border: 'none',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isClearLoading ? 'wait' : 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
          disabled={isAnyLoading}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (dish.product && dish.variant && dish.variant.id != null) {
              setIsClearLoading(true);
              try {
                await clearItemFromCart(dish.product.id, dish.variant.id);
              } finally {
                setIsClearLoading(false);
              }
            } else {
              console.warn("Cannot clear item from cart: Product or Variant ID is missing for cart item", dish.id);
            }
          }}
          aria-label="Remove item from cart"
        >
          {isClearLoading ? (
            <div style={{
              width: '10px',
              height: '10px',
              border: '2px solid rgba(255,255,255,0.4)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : (
            <XIconSvg />
          )}
          {/* <span style={{ color: '#fff' }}>-</span> */}
        </button>

        <Link
          href={`${Routes.MENU_ITEM}/${dish.product.id}`}
          style={{
            paddingRight: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            borderRadius: 'var(--border-radius)',
            backgroundColor: 'var(--white-color)',
            border: hasError ? '2px solid #DC2626' : 'none',
            opacity: hasError ? 0.8 : 1,
          }}
        >
          <Image
            src={dish.variant.additional_images?.[0] || dish.product?.variants[0].additional_images[0] || itemPlaceholder}
            alt={'dish'}
            width={0}
            height={0}
            sizes='100vw'
            className='order-item-image'
          />
          <div style={{ marginRight: 'auto' }}>
            <dishItem.DishName
              name={dish.product?.name}
              variant_name={dish.variant.variants || 'variant'}
              style={{ marginBottom: 4 }}
            />
            <span
              style={{ marginBottom: 14 }}
              className='t10 number-of-lines-1'
            >
              {/* {dish.variants.} kcal - {dish.weight} g */}
            </span>
            <dishItem.DishPrice price={dish.variant.sale_price} quantity={availableQuantity} />
          </div>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              style={{
                padding: '14px 14px 4px 14px',
                borderRadius: 4,
                opacity: isAnyLoading ? 0.5 : 1,
                cursor: isAnyLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isAnyLoading}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (dish.product && dish.variant && dish.variant.id != null) {
                  setIsRemoveLoading(true);
                  try {
                    await removeFromCart(dish.product.id, dish.variant.id);
                  } finally {
                    setIsRemoveLoading(false);
                  }
                } else {
                  console.warn("Cannot remove from cart: Product or Variant ID is missing for cart item", dish.id);
                }
              }}
            >
              {isRemoveLoading ? (
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #ccc',
                  borderTop: '2px solid #0C1D2E',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : (
                <MinusSvg />
              )}
            </button>
            <span
              className='t12'
              style={{ lineHeight: 1 }}
            >
              {dish?.quantity}
            </span>
            <button
              style={{
                padding: '4px 14px 14px 14px',
                borderRadius: 4,
                opacity: isOutOfStock || isAnyLoading ? 0.5 : 1,
                cursor: isOutOfStock || isAnyLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isOutOfStock || isAnyLoading}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (isOutOfStock) return;
                if (dish.product && dish.variant && dish.variant.id != null) {
                  setIsAddLoading(true);
                  try {
                    await addToCart(dish.product.id, dish.variant.id);
                  } finally {
                    setIsAddLoading(false);
                  }
                } else {
                  console.warn("Cannot add to cart: Product or Variant ID is missing for cart item", dish.id);
                }
              }}
            >
              {isAddLoading ? (
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #ccc',
                  borderTop: '2px solid #0C1D2E',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : (
                <PlusSvg />
              )}
            </button>
          </div>
        </Link>

        {/* Red tag overlay for out of stock items */}
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '25%', // Same as image width
              backgroundColor: '#DC2626',
              color: 'white',
              padding: '6px 4px',
              borderRadius: '4px 4px 0 0', // Rounded top corners only
              fontSize: '9px',
              fontWeight: '600',
              zIndex: 15,
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
              lineHeight: '1.3',
              textAlign: 'center',
              wordWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            Out of Stock
          </div>
        )}

        {/* Warning message for quantity exceeded or out of stock */}
        {hasError && (
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '0',
              right: '0',
              backgroundColor: '#FED7D7',
              border: '1px solid #FEB2B2',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '11px',
              color: '#C53030',
              fontWeight: 'var(--fw-medium)',
              textAlign: 'center',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {isOutOfStock ? (
              '🚫 This item is currently out of stock'
            ) : (
              `⚠️ Only ${availableQuantity} available (You have ${dish.quantity})`
            )}
          </div>
        )}
      </div>
    </li>
  );
};
