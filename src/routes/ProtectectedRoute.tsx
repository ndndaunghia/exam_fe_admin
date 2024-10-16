import React, { memo, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchUserDataAsync } from '../services/auth/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, user, loading } = useSelector((state: RootState) => state.auth, shallowEqual);

  useEffect(() => {
    if (!user && token) {
      dispatch(fetchUserDataAsync());
    }
  }, [dispatch, user, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? <>{children}</> : <Navigate to="/auth/signin" />;
};

export default memo(ProtectedRoute);
