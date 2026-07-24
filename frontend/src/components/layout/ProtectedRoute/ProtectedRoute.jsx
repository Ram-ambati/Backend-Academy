import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';

/**
 * ProtectedRoute — wraps content that requires authentication and specific roles.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
