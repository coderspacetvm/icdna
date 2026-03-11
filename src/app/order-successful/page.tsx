import type {Metadata} from 'next';

import {OrderSuccessful} from './OrderSuccessful';

export const metadata: Metadata = {
  title: 'Order Successful',
  description: 'Your order has been successful.',
};

export default function NewPasswordPage() {
  return <OrderSuccessful />;
}
