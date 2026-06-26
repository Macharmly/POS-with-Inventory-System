import {
  Navigate,
  Outlet
} from 'react-router-dom';

import {
  useAuthStore
} from '../store/authStore';

interface Props {
  allowedRoles: string[];
}

export default function RoleProtectedRoute({
  allowedRoles
}: Props) {

  const user = useAuthStore(
    (state) => state.user
  );

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}