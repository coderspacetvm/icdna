import { DM_Sans, Outfit } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import 'swiper/css';
import '../scss/_index.scss';
import SessionProvider from './SessionProvider';
import NotificationListener from '@/components/NotificationListener';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { AuthProvider } from '@/components/AuthProvider';
// import TestNotification from '@/components/TestNotification';
// import NotificationListener from '@/components/NotificationListener';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const viewport: Viewport = { themeColor: '#F6F9F9' };
export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: {
    template: 'ICDNA - %s',
    default: 'ICDNA'
  },
  description: 'Discover delicious food and explore our menu at ICDNA. Order your favorite dishes with ease.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0'
        />
      </head>
      <body
        id='app'
        className={`${dmSans.variable} ${outfit.variable}`}
        style={{ backgroundColor: '#F6F9F9' }}
      >
        <SessionProvider>
          <AuthProvider>
            <ServiceWorkerRegistration />
            <NotificationListener />
            {/* <TestNotification /> */}
            <Toaster
              position="top-center"
              toastOptions={{
                // Define default options
                duration: 5000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
