'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { svg } from '../svg';
import { URLS } from '../config';
import { Routes, TabScreens } from '../routes';
import { stores } from '../stores';
import { Switcher } from './Switcher';
import NotificationToggle from './NotificationToggle';
import { hooks } from '@/hooks';
import { createApiService } from '@/lib/axios/apiService';
import { authClient } from '@/lib/axios/apiClient';
import { urls } from '@/lib/config/urls';
import { getFCMToken } from '@/notification/firebase.js';
import { useAuth } from './AuthProvider';
// import { requireAuth } from '../utils/authUtils';

const modalMenu = [
  {
    id: 1,
    title: 'Personal information',
    route: Routes.EDIT_PROFILE,
    switch: false,
    requiredAuth: true
  },
  {
    id: 2,
    title: 'My orders',
    route: Routes.ORDER_HISTORY,
    switch: false,
    requiredAuth: true
  },
  // {
  //   id: 3,
  //   title: 'My orders Empty',
  //   route: Routes.ORDER_HISTORY_EMPTY,
  //   switch: false,
  // },
  // {
  //   id: 4,
  //   title: 'Promocodes & gift cards',
  //   route: Routes.PROMOCODES,
  //   switch: false,
  //   requiredAuth : true
  // },
  // {
  //   id: 5,
  //   title: 'Promocodes Empty',
  //   route: Routes.PROMOCODES_EMPTY,
  //   switch: false,
  // },
  // {
  //   id: 6,
  //   title: 'Onboarding',
  //   route: Routes.ONBOARDING,
  //   switch: false,
  // },
  {
    id: 7,
    title: 'Notifications',
    route: '',
    switch: true,
    requiredAuth: true
  },
  // {
  //   id: 8,
  //   title: 'Face ID',
  //   route: '',
  //   switch: true,
  // },
  {
    id: 9,
    title: 'Support center',
    route: Routes.SUPPORT_CENTER,
    switch: false,
    requiredAuth: false
  },
  {
    id: 10,
    title: 'Sign out',
    route: Routes.SIGN_IN,
    switch: false,
    requiredAuth: true
  },
  {
    id: 11,
    title: 'Sign in',
    route: Routes.SIGN_IN,
    switch: false,
    requiredAuth: false
  },
];

export const Modal: React.FC = () => {
  const router = useRouter();
  const { logout } = hooks.useAuthentication();
  const { openAuthModal } = useAuth();

  // Create private API service for FCM token API
  const privateApiService = createApiService(authClient);

  const isAuthenticated = () => {
    return !!Cookies.get("authToken");
  };

  // FCM Token cleanup function for logout
  const handleFCMTokenCleanup = async () => {
    try {
      const fcmToken = getFCMToken();
      if (fcmToken) {
        // Call DELETE API to remove FCM token from backend
        await privateApiService.delete(urls['fcm-token'], {
          data: { fcm_token: fcmToken }
        });
        console.log('FCM token removed from backend');
      }

      // Remove FCM token from localStorage
      localStorage.removeItem('fcm_token');
      localStorage.removeItem('notifications_enabled');
      console.log('FCM token removed from localStorage');
    } catch (error) {
      console.error('Error during FCM token cleanup:', error);
    }
  };

  const { isOpen, closeModal } = stores.useModalStore();

  // Filter menu items based on authentication status
  const filteredMenuItems = modalMenu.filter(item => {
    const authenticated = isAuthenticated();

    // If user is authenticated, show items that require auth OR don't require auth (but not "Sign in")
    if (authenticated) {
      return item.title !== 'Sign in';
    }
    // If user is not authenticated, only show items that don't require auth
    else {
      return !item.requiredAuth;
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.backgroundColor = '#fff';

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#fff');
      }

      return () => {
        document.body.style.backgroundColor = '';
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', '');
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(30, 37, 56, 0.6)',
        zIndex: 101,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '80%',
          backgroundColor: 'var(--white-color)',
          zIndex: 99999,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* User information section - only show if authenticated */}
        {isAuthenticated() && (
          <div
            style={{
              paddingTop: '20%',
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 27,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingBottom: 20,
              borderBottom: '1px solid #DBE9F5',
            }}
          >
            <Image
              width={60}
              height={60}
              alt='user'
              style={{ borderRadius: 30 }}
              priority={true}
              src={localStorage.getItem("image") || `${URLS.MAIN_URL}/assets/users/01.jpg`}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className='t14'
                style={{
                  color: 'var(--main-dark)',
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                {localStorage.getItem("name")}
              </span>
              <span className='t14'>{localStorage.getItem("email")}</span>
            </div>
          </div>
        )}
        {/* Menu items */}
        <ul style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingTop: isAuthenticated() ? 0 : '10%' // Add top padding if not authenticated
        }}>
          {filteredMenuItems.map((item, index, array) => {
            const isLast = index === array.length - 1;

            if (item.requiredAuth && isAuthenticated()) {
              return (
                <li
                  key={item.id}
                  style={{
                    paddingTop: 6,
                    paddingBottom: 6,
                    marginBottom: isLast ? 0 : 6,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onClick={async () => { // Make async for signOut
                    if (item.title === 'Sign out') {
                      closeModal();
                      // Clean up FCM token before logout
                      await handleFCMTokenCleanup();
                      logout(); // Clear local cookie and cart/wishlist data
                      await signOut({ callbackUrl: `${Routes.TAB_NAVIGATOR}?screen=${TabScreens.HOME}` }); // Clear NextAuth session and redirect to Home
                    } else if (item.title === 'Sign in') {
                      closeModal();
                      openAuthModal(); // Open auth modal instead of redirecting
                    } else if (item.route !== '') {
                      closeModal();
                      router.push(item.route);
                    }
                  }}
                  className='clickable'
                >
                  <span
                    className='t16 number-of-lines-1'
                    style={
                      item.title === 'Sign out'
                        ? { color: '#FA5555' }
                        : item.title === 'Sign in'
                          ? { color: '#22C55E' } // Green color for Sign in
                          : { color: 'var(--main-dark)' }
                    }
                  >
                    {item.title}
                  </span>
                  {item.route !== '' && item.title !== 'Sign out' && (
                    <svg.RightArrowSvg />
                  )}
                  {item.switch && item.title === 'Notifications' && isAuthenticated() ? (
                    <NotificationToggle
                      onClick={(enabled) => {
                        console.log('Notifications:', enabled ? 'enabled' : 'disabled');
                      }}
                    />
                  ) : (
                    item.switch && <Switcher
                      onClick={(val) => {
                        // Handle other switches here if needed
                        console.log('Switch toggled:', val);
                      }}
                    />
                  )}
                </li>
              );
            }

            return (
              <li
                key={item.id}
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  marginBottom: isLast ? 0 : 6,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onClick={async () => { // Make async for signOut
                  if (item.title === 'Sign out') {
                    closeModal();
                    // Clean up FCM token before logout
                    await handleFCMTokenCleanup();
                    logout(); // Clear local cookie and cart/wishlist data
                    await signOut({ callbackUrl: `${Routes.TAB_NAVIGATOR}?screen=${TabScreens.HOME}` }); // Clear NextAuth session and redirect to Home
                  } else if (item.title === 'Sign in') {
                    closeModal();
                    openAuthModal(); // Open auth modal instead of redirecting
                  } else if (item.route !== '') {
                    closeModal();
                    router.push(item.route);
                  }
                }}
                className='clickable'
              >
                <span
                  className='t16 number-of-lines-1'
                  style={
                    item.title === 'Sign out'
                      ? { color: '#FA5555' }
                      : item.title === 'Sign in'
                        ? { color: '#22C55E' } // Green color for Sign in
                        : { color: 'var(--main-dark)' }
                  }
                >
                  {item.title}
                </span>
                {item.route !== '' && item.title !== 'Sign out' && (
                  <svg.RightArrowSvg />
                )}
                {(
                  item.switch && <Switcher
                    onClick={(val) => {
                      // Handle other switches here if needed
                      console.log('Switch toggled:', val);
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '80%',
          transform: 'translateX(0%)',
        }}
        className='clickable'
        onClick={closeModal}
      >
        <svg.CrossSvg />
      </div>
    </div>
  );
};
