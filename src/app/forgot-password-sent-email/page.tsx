import type {Metadata} from 'next';
import { ForgotPasswordSentEmail } from './ForgotPasswordSentEmail';

export const metadata: Metadata = {
  title: 'Forgot Password Sent Email',
  description: 'Your password has been reset.',
};

export default function ForgotPasswordSentEmailPage() {
  return <ForgotPasswordSentEmail />;
}
