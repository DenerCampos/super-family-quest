import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';

export function RequireAuth({ children }: Readonly<{ children: JSX.Element }>) {
  const { profile } = useAuth(); 

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
