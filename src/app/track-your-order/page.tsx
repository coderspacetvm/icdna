import type {Metadata} from 'next';

import {TrackYourOrder} from './TrackYourOrder';

export const metadata: Metadata = {
  title: 'Verify Your Phone Number',
  description: 'Verify Your Phone Number',
};

export default function Page() {
  return <TrackYourOrder />;
}
