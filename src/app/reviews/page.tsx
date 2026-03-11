'use client';

import {Reviews} from './Reviews';
import withAuth from '@/hoc/withAuth';


function Page() {
  return <Reviews />;
}

export default withAuth(Page)
