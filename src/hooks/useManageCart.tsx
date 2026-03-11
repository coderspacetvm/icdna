import { createApiService } from "@/lib/axios/apiService";
import authClient from "@/lib/axios/authClient";
import { urls } from "@/lib/config/urls";

const privateApiService = createApiService(authClient)


export const useManageCart = () => {

  const addToCart = async (product_id:number,variant_id:number) => {
      try {
        const res = await privateApiService.post(urls["add-to-cart"],{
          product_id,
          variant_id
        })
        if (res) {
          return true
        } else return false
      } catch (error) {
        console.error(error);
        return false
      } 
    };

  const removeFromCart = async (product_id:number,variant_id:number) => {
      try {
        const res = await privateApiService.post(urls["remove-from-cart"],{
          product_id,
          variant_id
        })
        if (res) {
          return true
        } else return false
      } catch (error) {
        console.error(error);
        return false
      } 
    };
  

  return {addToCart, removeFromCart};
};
