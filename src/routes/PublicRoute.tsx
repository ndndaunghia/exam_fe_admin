import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  // Nếu đã có token (tức là đã đăng nhập), điều hướng tới trang chủ
  if (token) {
    return <Navigate to="/" />;
  }

  // Nếu chưa đăng nhập, cho phép truy cập vào trang public
  return <>{children}</>;
};

export default PublicRoute;
