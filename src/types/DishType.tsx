export type Variants = {
  mrp: number,
  sale_price: number,
  quantity: number,
  discount: number,
  discount_percentage: number
}
export type VariantExtended = Variants & {
  id: number;
  variant_values: any[];
  additional_images: string[];
  created_at: string;
  updated_at: string;
  last_edited_field: string | null;
  max_order_quantity: number;
  is_deleted: boolean;
  is_active: string;
  is_favorite : boolean | null;
  variants ?:string;
};

export type DishType = {
    id: number
    variants: Variants 
    name: string
    image: string 
    is_active: string
    product_details: string
    product_description: string
    featured: boolean
    created_at: string // ISO datetime format
    updated_at: string // ISO datetime format 
    total_order_count: number
    average_rating: number
    reviews_count: number
    is_deleted: boolean
    hsn_code: string
    approval_status: string
    rejection_reason: string | null
    category: number
    tax: number
    quantity ? :number
};


export type ProductType = Omit<DishType, 'variants'> & {
  wishlist: any;
  product_variant_entries: any[];
  variants: VariantExtended[];
}
export type WishListedProductType = Omit<DishType, 'variants'> & {
  wishlist: any;
  product_variant_entries: any[];
  variants: VariantExtended[];
}


