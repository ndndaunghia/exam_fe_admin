
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth?.user?.role === 'admin');

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;
