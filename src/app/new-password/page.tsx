import type {Metadata} from 'next';

import {NewPassword} from './NewPassword';

export const metadata: Metadata = {
  title: 'New Password',
  description:
    'Create a new password to secure your account. Please enter your new password below.',
};

export default function NewPasswordPage() {
  return <NewPassword />;
}
