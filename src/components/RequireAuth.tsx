import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { useEffect, useState } from 'react';

export function RequireAuth({ children }: Readonly<{ children: JSX.Element }>) {
  const { profile } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const hasToken = !!localStorage.getItem('accessToken');

  useEffect(() => {
    if (!hasToken) {
      setIsVerifying(false);
      return;
    }

    if (profile) {
      setIsVerifying(false);
    }
  }, [profile, hasToken]);

  if (isVerifying) {
    return <LoadingOverlay typeLoading="read" />;
  }

  if (!hasToken || !profile) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
