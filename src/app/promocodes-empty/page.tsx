import type {Metadata} from 'next';

import {PromocodesEmpty} from './PromocodesEmpty';

export const metadata: Metadata = {
  title: 'Promocodes Empty',
  description: 'Promocodes are empty.',
};

export default function Page() {
  return <PromocodesEmpty />;
}
