import type {Metadata} from 'next';

import {OrderHistoryEmpty} from './OrderHistoryEmpty';

export const metadata: Metadata = {
  title: 'Order History Empty',
  description: 'Your order history is empty.',
};

export default function OrderHistoryEmptyPage() {
  return <OrderHistoryEmpty />;
}
