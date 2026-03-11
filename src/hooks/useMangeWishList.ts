// import React from 'react';
import { urls } from '@/lib/config/urls';
import {authClient} from '@/lib/axios/apiClient'
import { createApiService } from '@/lib/axios/apiService';
import { ApiResponse } from '@/types/apiRelatedTypes';
import { WishlistResponse } from '@/types/WishListTypes';


const privateApiService = createApiService(authClient)

export const useManageWishList = () => {
  // const [wishListItems,setWishList] = React.useState<WishlistResponse | null>(null)

  const getAllWishListItems = async () => {
    try {
      const res = await privateApiService.get<WishlistResponse>(urls['wishlist-page'])
      if (res.status === 1) {
        // setWishList(res)
      }
    } catch (error) {
      console.error('wishlist error :',error);
    }
  }

  const updateWishlistWithItem = async (product_id:number,variant_id:number) => {
    
    try {
      const res = await privateApiService.post<ApiResponse>(urls['item-update-to-wishlist'],{
        product_id,
        variant_id
      })
      
      res.status === 1 ? true : false
    } catch (error) {
      console.error(error);
      return false
    } 
  };



  return {
    // wishListItems,
    
    getAllWishListItems,
    updateWishlistWithItem,
  };
};
