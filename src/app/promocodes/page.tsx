'use client'

import {Promocodes} from './Promocodes';
import withAuth from '../../hoc/withAuth';

function Page() {
  return <Promocodes />;
}

export default withAuth(Page);
