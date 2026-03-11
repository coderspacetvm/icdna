interface Variant {
  id: number;
  additional_images: string[];
  variants: string;
  is_favorite: boolean;
  mrp: number;
  sale_price: number;
  discount: number;
  discount_percentage: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  max_order_quantity: number;
  is_deleted: boolean;
  is_active: string;
}

interface Product {
  id: number;
  variants: Variant[];
  name: string;
  is_active: string;
  product_details: string;
  product_description: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  total_order_count: number;
  average_rating: number;
  reviews_count: number;
  is_deleted: boolean;
  hsn_code: string;
  approval_status: string;
  rejection_reason: string | null;
  category: number;
  subcategory: number;
  tax: number;
}

interface CartItem {
  id: number;
  product: Product;
  variant: Variant;
  quantity: number;
  created_at: string;
  updated_at: string;
  cart: number;
  user: number;
}

export type AppliedCoupon = {
  code: string;
  type: string;
  discount_amount: number;
  minimum_order: number;
  valid_till: string;
};

interface Cart {
  id: number;
  cart_items: CartItem[];
  coupon_exists: boolean;
  coupon_status: string;
  applied_coupon: AppliedCoupon | null;
  sub_total: string;
  saleprice_total: string;
  discount: string;
  coupon_discount: string;
  total_discount: string;
  platform_fee: string;
  delivery_charge: string;
  payable_amount: string;
  created_at: string;
  updated_at: string;
  user: number;
}

interface Coupon {
  id: number;
  is_valid: boolean;
  discount_summary: string;
  discount_text: string;
  active: any | null;
  name: string;
  description: string | null;
  code: string;
  discount_type: string;
  discount_value: string;
  valid_from: string;
  valid_to: string;
  max_usage: number;
  per_user_count: number;
  used_count: number;
  minimum_order: string;
  coupon_type: string;
  public_display: boolean;
  is_active: boolean;
  created_at: string;
}

interface CartResponse {
  status: number;
  message: string;
  cart: Cart;
  coupons: Coupon[];
}

export interface CouponApplyResponse {
  status: number;
  message: string;
  cart: Cart;
}

export type { CartResponse, Cart, CartItem, Coupon, Product, Variant };
