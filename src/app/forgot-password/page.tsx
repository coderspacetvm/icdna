import type {Metadata} from 'next';

import {ForgotPassword} from './ForgotPassword';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'If you have forgotten your password, you can reset it here.',
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
