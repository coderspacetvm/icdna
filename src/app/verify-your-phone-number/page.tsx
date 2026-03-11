import type {Metadata} from 'next';

import {VerifyYourPhoneNumber} from './VerifyYourPhoneNumber';

export const metadata: Metadata = {
  title: 'Verify Your Phone Number',
  description:
    'Please verify your phone number to secure your account and access all features.',
};

export default function Page() {
  return <VerifyYourPhoneNumber />;
}
