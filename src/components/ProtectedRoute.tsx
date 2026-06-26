import {
  Navigate,
  Outlet,
  useLocation,
  matchPath
} from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { rolePermissions } from '../config/permissions';

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const allowedRoutes =
    rolePermissions[user.role as keyof typeof rolePermissions] || [];

  const hasAccess = allowedRoutes.some((route) =>
    matchPath(
      {
        path: route,
        end: true
      },
      location.pathname
    )
  );

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}