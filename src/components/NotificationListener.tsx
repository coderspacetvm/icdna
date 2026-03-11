'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { onMessageListener, areNotificationsEnabled } from '@/notification/firebase.js';
import NotificationToast from './NotificationToast';

const NotificationListener = () => {
  const [toastIds, setToastIds] = useState<string[]>([]);
  console.log(toastIds);

  useEffect(() => {
    onMessageListener((payload: any) => {
      // Check if notifications are enabled by user before showing
      if (!areNotificationsEnabled()) {
        console.log('Notifications disabled by user, not showing toast');
        return;
      }

      const newToastId = toast.custom((t) => (
        <NotificationToast
          title={payload.notification.title}
          body={payload.notification.body}
          t={t}
          image={payload.webpush?.headers?.image}
        />
      ), {
        duration: 5000, // Explicitly set duration to 5 seconds
      });
      
      setToastIds((prevToastIds) => {
        const newToastIds = [...prevToastIds, newToastId];
        if (newToastIds.length > 2) {
          const oldestToastId = newToastIds.shift();
          toast.dismiss(oldestToastId);
        }
        return newToastIds;
      });
    });
  }, []);

  return null;
};

export default NotificationListener;
