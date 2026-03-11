// src/types/ApiOrderTypes.ts

export interface ApiProduct {
  id: number;
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

export interface ApiOrderItem {
  id: number;
  product: ApiProduct;
  sale_price: number;
  mrp: number;
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  order: number;
  user: number;
  variant: number;
}

export interface ApiAddress {
  id: number;
  address: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  estimated_delivery_date: number | string | null;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface ApiOrder {
  id: number;
  order_items: ApiOrderItem[];
  address: ApiAddress;
  user_name: string;
  user_mobile_number: string;
  coupon_message: string | null;
  ids: string; // maps to OrderType.id in the component if it's the display ID
  sub_total: number;
  discount: number;
  delivery_charge: number;
  payable_amount: number; // maps to OrderType.total
  created_at: string; // maps to OrderType.date and OrderType.time
  updated_at: string;
  status: string; // maps to OrderType.status
  cancelled_reason: string | null;
  cancelled_date: string | null;
  cancelled_by: string | null;
  delivered_date: string | null;
  replacement_reason: string | null;
  replacement_date: string | null;
  razorpay_order_id: string | null;
  payment_status: string | null;
  order_type: string | null
  scheduled_date: string | null
  user: number;
  applied_coupon: string | null;
  delivery_boy: number | null;
  invoice_pdf?: string | null;
}

export interface ApiOrdersResponse {
  status: number; // Overall status of the API call (1 for success, 0 for failure)
  orders: ApiOrder[];
  count: number;
  next: string | null;
  previous: string | null;
  // Assuming 'message' might also be part of the response as per typical API design
  message?: string;
}
