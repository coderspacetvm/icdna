import type {Metadata} from 'next';

import {FAQ} from './FAQ';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions.',
};

export default function FAQPage() {
  return <FAQ />;
}
