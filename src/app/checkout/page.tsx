import type {Metadata} from 'next';

import {Checkout} from './Checkout';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Confirm your order and proceed to checkout.',
};

export default function CheckoutPage() {
  return <Checkout />;
}
