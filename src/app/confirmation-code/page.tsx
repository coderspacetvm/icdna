import type {Metadata} from 'next';

import {ConfirmationCode} from './ConfirmationCode';

export const metadata: Metadata = {
  title: 'Confirmation Code',
  description:
    'Please enter the confirmation code sent to your phone to verify your phone number and secure your account.',
};

export default function ConfirmationCodePage() {
  return <ConfirmationCode />;
}
