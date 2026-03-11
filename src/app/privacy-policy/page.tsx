import type {Metadata} from 'next';

import {PrivacyPolicy} from './PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy.',
};

export default function Page() {
  return <PrivacyPolicy />;
}
