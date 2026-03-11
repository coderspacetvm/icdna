import { ProductType } from "./DishType";

export type WishlistResponse = {
  status: number;
  count: number;
  wishlist: {
    product: ProductType;
  }[];
};


// export type WishlistProductResponse = {
//   status: number;
//   count: number;
//   wishlist: {
//     product: Omit<DishType, 'variants'>; 
//   }[];
// };
