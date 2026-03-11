import type {Metadata} from 'next';

import {PaymentSuccess} from './PaymentSuccess';

export const metadata: Metadata = {
  title: 'Payment Success',
  description: 'Your payment has been successful.',
};

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
