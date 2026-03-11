import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '../config';
import {NotificationType} from '../types';

export const useGetNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState<boolean>(false);

  const getDishes = async () => {
    setNotificationsLoading(true);

    try {
      const response = await axios.get(URLS.GET_NOTIFICATIONS);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error(error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  return {notificationsLoading, notifications};
};
