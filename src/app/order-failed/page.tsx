import type {Metadata} from 'next';

import {OrderFailed} from './OrderFailed';

export const metadata: Metadata = {
  title: 'Order Failed',
  description: 'Your order has failed. Please try again.',
};

export default function NewPasswordPage() {
  return <OrderFailed />;
}
