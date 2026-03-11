'use client';

import { EditProfile } from './EditProfile';
import withAuth from '../../hoc/withAuth';

function EditProfilePage() {
  return <EditProfile />;
}

export default withAuth(EditProfilePage);
