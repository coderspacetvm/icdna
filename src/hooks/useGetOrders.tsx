import { useState, useEffect } from 'react';
import { createApiService } from '@/lib/axios/apiService';
import authClient from '@/lib/axios/authClient';
import { urls } from '@/lib/config/urls';
import { OrderType, OrderStatus } from '../types/OrderType'; // Assuming OrderStatus is exported from OrderType.tsx
import { ApiOrdersResponse, ApiOrder, ApiOrderItem } from '../types/ApiOrderTypes';

const privateApiService = createApiService(authClient);

// Helper function to transform API order status to OrderStatus type
const mapApiStatusToOrderStatus = (apiStatus: string): OrderStatus => {
  switch (apiStatus.toLowerCase()) {
    case 'waiting confirmation':
      return 'Waiting Confirmation';
    case 'order confirmed':
      return 'Order Confirmed';
    case 'delivery boy assigning':
      return 'Delivery Boy Assigning';
    case 'delivery boy assigned':
      return 'Delivery Boy Assigned';
    case 'in transit':
      return 'In Transit';
    case 'out for delivery':
      return 'Out For Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
    case 'canceled':
      return 'Cancelled';
    case 'refunded':
      return 'Refunded';
    case 'delivery boy rejected':
      return 'Delivery Boy Rejected';
    default:
      return 'Waiting Confirmation'; // Default to first step
  }
};

// Helper function to format date and time
const formatDateTime = (dateTimeString: string): { date: string; time: string } => {
  try {
    const dateObj = new Date(dateTimeString);
    const date = dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date, time };
  } catch (e) {
    console.error("Error formatting date:", e);
    return { date: "N/A", time: "N/A" };
  }
};

const transformApiOrderToOrderType = (apiOrder: ApiOrder): OrderType => {
  console.log('api order :', apiOrder);

  const { date, time } = formatDateTime(apiOrder.created_at);

  let formattedEstimatedDate = null;
  if (apiOrder.address && apiOrder.order_type !== 'Pre-Order') {
    const createdDate = new Date(apiOrder.created_at);
    // Support parsing strings or numbers, fallback 0
    let daysToAdd = 0;
    if (apiOrder.address.estimated_delivery_date) {
      daysToAdd = parseInt(apiOrder.address.estimated_delivery_date as string, 10) || 0;
    }

    createdDate.setDate(createdDate.getDate() + daysToAdd);
    const day = String(createdDate.getDate()).padStart(2, '0');
    const month = String(createdDate.getMonth() + 1).padStart(2, '0');
    const year = createdDate.getFullYear();
    formattedEstimatedDate = `${day}-${month}-${year}`;
  }

  return {
    id: apiOrder.id, // Using the numeric id from API
    date: date,
    time: time,
    ids: apiOrder.ids,
    status: mapApiStatusToOrderStatus(apiOrder.status),
    total: apiOrder.payable_amount,
    discount: apiOrder.discount,
    delivery: apiOrder.delivery_charge,
    products: apiOrder.order_items.map((item: ApiOrderItem) => ({
      id: item.product.id, // Or item.id if that's more appropriate for product line item
      name: item.product.name,
      quantity: item.quantity,
      price: item.sale_price,
    })),
    order_type: apiOrder.order_type,
    scheduled_date: apiOrder.scheduled_date,
    invoice_pdf: apiOrder.invoice_pdf,
    estimated_delivery_date: formattedEstimatedDate,
  };
};

export const useGetOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setError(null);
      try {
        const response = await privateApiService.get<ApiOrdersResponse>(urls["get-orders"]);
        if (response && response.status === 1 && response.orders) {
          setOrders(response.orders.map(transformApiOrderToOrderType));
        } else {
          // Handle cases where API call was technically successful but business logic failed
          console.error("Failed to fetch orders:", response?.message || "No orders data");
          setOrders([]);
          setError(response?.message || "Could not retrieve orders.");
        }
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setOrders([]);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, ordersLoading, error };
};
