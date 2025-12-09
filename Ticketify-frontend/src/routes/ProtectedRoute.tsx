import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken, getCurrentUser } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; 
  redirectTo?: string;
}

const ProtectedRoute = ({ children, roles, redirectTo = '/login' }: ProtectedRouteProps) => {
  const token = getAccessToken();
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="*" replace />;
  }

  return children;
};

export default ProtectedRoute;
