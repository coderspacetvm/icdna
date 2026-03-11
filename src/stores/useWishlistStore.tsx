import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistResponse } from '@/types/WishListTypes';
import { createApiService } from '@/lib/axios/apiService';
import { authClient } from '@/lib/axios/apiClient';
import { urls } from '@/lib/config/urls';
import { ApiResponse } from '@/types/apiRelatedTypes';

const privateApiService = createApiService(authClient);

type WishlistStateType = {
  list: WishlistResponse['wishlist'];
  wishlistedIds: number[]; // Added to store IDs of wishlisted items
  fetchWishlist: () => Promise<void>;
  toggleWishlistItem: (product_id: number, variant_id: number) => Promise<boolean>;
  isWishlisted: (product_id: number) => boolean; // Selector function
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStateType>()(
  persist(
    (set, get) => ({
      list: [],
      wishlistedIds: [], 
      fetchWishlist: async () => {
        try {
          const res = await privateApiService.get<WishlistResponse>(urls['wishlist-page']);
          if (res.status === 1) {
            const newWishlistedIds = res.wishlist.map(item => item.product.id);
            set({ list: res.wishlist, wishlistedIds: Array.from(new Set(newWishlistedIds)) });
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      },

      toggleWishlistItem: async (product_id: number, variant_id: number) => {
        try {
          const res = await privateApiService.post<ApiResponse>(urls['item-update-to-wishlist'], {
            product_id,
            variant_id,
          });

          if (res.status === 1) {
            await get().fetchWishlist(); 
            return true;
          }

          return false;
        } catch (error) {
          console.error('Failed to update wishlist item:', error);
          return false;
        }
      },

      isWishlisted: (product_id: number) => {
        return get().wishlistedIds.includes(product_id);
      },

      clearWishlist: () => {
        set({ list: [], wishlistedIds: [] });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
