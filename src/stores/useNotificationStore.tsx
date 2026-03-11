import { create } from 'zustand';
import { createApiService } from '@/lib/axios/apiService';
import { authClient } from '@/lib/axios/apiClient';
import { urls } from '@/lib/config/urls';
import { NotificationType } from '@/types/NotificationType';

const privateApiService = createApiService(authClient);

interface NotificationResponse {
  status: number;
  notifications: NotificationType[];
}

type NotificationStateType = {
  notifications: NotificationType[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  // TODO: Add action to mark notification as seen if needed in future
};

const initialState = {
  notifications: [],
  isLoading: false,
  error: null,
};

export const useNotificationStore = create<NotificationStateType>()((set) => ({
  ...initialState,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await privateApiService.get<NotificationResponse>(urls['notifications']);
      if (res.status === 1) {
        set({ notifications: res.notifications, isLoading: false });
      } else {
        set({ error: 'Failed to fetch notifications', isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ error: 'An error occurred while fetching notifications', isLoading: false });
    }
  },
}));

// Update src/stores/index.tsx to include the new store

export const stores = {
  useCartStore: require('./useCartStore').useCartStore,
  useGlobalStore: require('./useGlobalStore').useGlobalStore,
  useMenuByCatagoryStore: require('./useMenuByCatagoryStore').useMenuByCatagoryStore,
  useModalStore: require('./useModalStore').useModalStore,
  useTabStore: require('./useTabStore').useTabStore,
  useWalletStore: require('./useWalletStore').useWalletStore,
  useWishlistStore: require('./useWishlistStore').useWishlistStore,
  useNotificationStore: require('./useNotificationStore').useNotificationStore, // Added this line
};
