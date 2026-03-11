"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { SignInWithGoogle } from './SignInWithGoogle';
import { Routes, TabScreens } from '../../routes';

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if authToken exists in cookies
      const authToken = Cookies.get('authToken');
      if (authToken) {
        // Redirect to tab-navigator page with Home screen
        router.push(`${Routes.TAB_NAVIGATOR}?screen=${TabScreens.HOME}`);
      }
    }
  }, [router]);

  // Render the new component
  return <SignInWithGoogle />;
}
