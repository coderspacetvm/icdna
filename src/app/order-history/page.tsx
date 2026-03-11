'use client';

import {OrderHistory} from './OrderHistory';
import withAuth from '../../hoc/withAuth';


function NewPasswordPage() {
  return <OrderHistory />;
}

export default withAuth(NewPasswordPage);
