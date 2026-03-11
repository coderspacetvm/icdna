import type {Metadata} from 'next';

import {SignUpAccountCreated} from './SignUpAccountCreated';

export const metadata: Metadata = {
  title: 'Sign Up Account Created',
  description: 'Account has been successfully created.',
};

export default function Page() {
  return <SignUpAccountCreated />;
}
