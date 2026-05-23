import {
  Navigate,
  useLocation
} from 'react-router-dom';

import {
  useAuthStore
} from '../store/authStore';

import {
  rolePermissions
} from '../config/permissions';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children
}: Props) {

  const user = useAuthStore(
    (state) => state.user
  );

  const location = useLocation();

  // Not logged in

  if (!user) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Get allowed routes based on role

  const allowedRoutes =
    rolePermissions[
      user.role as keyof typeof rolePermissions
    ] || [];

  // Check access

  const hasAccess =
    allowedRoutes.includes(
      location.pathname
    );

  // No permission

  if (!hasAccess) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}