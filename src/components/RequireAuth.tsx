import { Navigate } from 'react-router-dom';
import { CoinFlightProvider } from '../contexts/CoinFlightContext';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { useEffect, useState } from 'react';
import { ChatAssistantWidget } from './chat-assistant/ChatAssistantWidget';

export function RequireAuth({ children }: Readonly<{ children: JSX.Element }>) {
  const { profile } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const hasToken = !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

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

  return (
    <CoinFlightProvider>
      {children}
      <ChatAssistantWidget />
    </CoinFlightProvider>
  );
}
