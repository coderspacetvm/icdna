type ProductType = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export type OrderStatus =
  | 'Waiting Confirmation'
  | 'Order Confirmed'
  | 'Delivery Boy Assigning'
  | 'Delivery Boy Assigned'
  | 'In Transit'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded'
  | 'Delivery Boy Rejected';

export type OrderType = {
  id: number
  ids: string
  date: string
  time: string
  status: OrderStatus
  total: number
  discount: number
  delivery: number
  products: ProductType[]
  order_type?: string | null
  scheduled_date?: string | null
  invoice_pdf?: string | null;
  estimated_delivery_date?: string | null;
}
