'use client';

import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { stores } from '@/stores';
import { Routes, TabScreens } from '@/routes';

type CartToastProps = {
  t: any;
  hasItemsOverride?: boolean;
};

export const CartToast: React.FC<CartToastProps> = ({ t, hasItemsOverride }) => {
  const router = useRouter();
  const { cart } = stores.useCartStore();

  const hasItemsFromStore = !!cart?.cart_items?.length;
  const hasItems = hasItemsOverride ?? hasItemsFromStore;

  const handleDismiss = () => {
    toast.dismiss(t.id);
  };

  const handleGoToOrder = () => {
    toast.dismiss(t.id);
    router.push(`${Routes.TAB_NAVIGATOR}?screen=${TabScreens.ORDER}`);
  };

  // Avoid flicker when toast is leaving
  if (!t.visible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '16px 18px',
        borderRadius: 16,
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 249, 249, 0.95) 100%)',
        boxShadow:
          '0 18px 30px -12px rgba(12, 29, 46, 0.18), 0 6px 12px -4px rgba(6, 64, 43, 0.12)',
        color: 'var(--main-dark)',
        maxWidth: 420,
        minWidth: 300,
        fontFamily: 'var(--font-dm-sans)',
      }}
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 24,
          height: 24,
          borderRadius: 999,
          border: 'none',
          background: 'rgba(116, 139, 160, 0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: 'var(--text-color)',
        }}
      >
        ×
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background:
              'linear-gradient(135deg, var(--main-turquoise) 0%, #0a5a3d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
          }}
        >
          🛒
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--main-dark)',
            }}
          >
            Item added to cart
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              color: 'var(--text-color)',
              opacity: 0.85,
            }}
          >
            You can continue browsing or review your order.
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          marginTop: 6,
        }}
      >
        <button
          onClick={handleDismiss}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            border: '1px solid #dde6ee',
            backgroundColor: 'white',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            color: 'var(--main-dark)',
          }}
        >
          Continue shopping
        </button>
        {hasItems && (
          <button
            onClick={handleGoToOrder}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              backgroundColor: 'var(--main-turquoise)',
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Go to Order
          </button>
        )}
      </div>
    </div>
  );
};

// Store active toast IDs manually to limit them to 2
let activeToastIds: string[] = [];

export const showCartAddedToast = (options?: { hasItemsOverride?: boolean }) => {
  // If we already have 2 or more toasts, dismiss the oldest one
  if (activeToastIds.length >= 2) {
    const oldestId = activeToastIds.shift(); // Remove the oldest toast from the queue
    if (oldestId) {
      toast.dismiss(oldestId);
    }
  }

  const id = toast.custom(
    (t: any) => <CartToast t={t} hasItemsOverride={options?.hasItemsOverride} />,
    {
      duration: 3500,
    }
  );

  // Add the newly created toast to the queue
  activeToastIds.push(id);

  // Clean up the queue if the toast auto-dismisses after 3500ms
  setTimeout(() => {
    activeToastIds = activeToastIds.filter(activeId => activeId !== id);
  }, 3500);
};

export default CartToast;



