import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;

  allowedRoles: string[];
}

export default function RoleProtectedRoute({
  children,
  allowedRoles
}: Props) {

  const user = useAuthStore(
    (state) => state.user
  );

  if (!user) {
    return <Navigate to="/" />;
  }

  if (
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}