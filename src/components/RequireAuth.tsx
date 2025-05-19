import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';

export function RequireAuth({ children }: Readonly<{ children: JSX.Element }>) {
  const { user } = useAuth();

  console.log(user);
  

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
