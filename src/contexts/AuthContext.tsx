import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../services';
import { registerUnauthorizedHandler, unregisterUnauthorizedHandler } from '../services/authSession';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { normalizeCoinDelta } from '../utils/coinsNumber';
import { isDemoSession } from '../utils/demoSession';

export type User = {
  id: string;
  email: string;
  name: string;
  family: string;
  coatOfArms: string;
  profileImage: string | null;
}
export type UserProfile = {
  user: User;
  income: number;
  expenses: number;
  coins: number;
  isFirstAccess: boolean;
  hasRecurringRevenues: boolean;
  hasRecurringExpenses: boolean;
};

type AuthContextType = {
  profile: UserProfile | null;
  /** Sessão via `/demo/:key` — perfil somente leitura no front; API bloqueia writes. */
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Persiste JWT, deriva `isDemo` e carrega o perfil (usado por DemoLogin e login). */
  establishSession: (accessToken: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  /** Ajuste otimista do saldo (ex.: após animação de moeda voadora). Reconcilie com loadProfile quando fizer sentido. */
  applyCoinsDelta: (delta: number) => void;
  showValues: boolean;
  toggleShowValues: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isDemo, setIsDemo] = useState(() => isDemoSession());
  const [showValues, setShowValues] = useState(() => {
    const savedShowValues = localStorage.getItem(LOCAL_STORAGE_KEYS.SHOW_VALUES);
    return savedShowValues ? JSON.parse(savedShowValues) : true;
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (token && !profile) {
      setIsDemo(isDemoSession());
      loadProfile().catch(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        setIsDemo(false);
        navigate('/login');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, navigate]);

  const loadProfile = useCallback(async () => {   
    try {
      const profile = await api.profile();
      setIsDemo(isDemoSession());
      
      setProfile({
        ...profile,
        coins: normalizeCoinDelta(profile.coins) ?? 0,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      throw error;
    }
  }, []);

  const waitForThemeLoad = useCallback(async () => {
    return new Promise<void>((resolve) => {
      const startTime = Date.now();
      const maxWaitTime = 5000; // 5 segundos de timeout

      const checkTheme = () => {
        // Verifica se o tema foi carregado no ThemeContext
        const themeContext = document.querySelector('[data-theme-loaded="true"]');
        if (themeContext) {
          resolve();
        } else if (Date.now() - startTime > maxWaitTime) {
          // Se passar do timeout, continua mesmo assim
          resolve();
        } else {
          setTimeout(checkTheme, 100); // Verifica a cada 100ms
        }
      };
      checkTheme();
    });
  }, []);

  const establishSession = useCallback(async (accessToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    setIsDemo(isDemoSession());
    try {
      await loadProfile();
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      setProfile(null);
      setIsDemo(false);
      throw error;
    }
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { accessToken } = await api.login({ email, password });
      await establishSession(accessToken);
      await waitForThemeLoad(); // Aguarda o tema ser carregado

      // Garante que o state foi atualizado antes de navegar
      setTimeout(() => navigate('/home'), 0);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [establishSession, navigate, waitForThemeLoad]);

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    setProfile(null);
    setIsDemo(false);
    queryClient.clear();
    navigate('/login');
  }, [navigate, queryClient]);

  useEffect(() => {
    registerUnauthorizedHandler(logout);
    return () => unregisterUnauthorizedHandler();
  }, [logout]);

  const toggleShowValues = useCallback(() => {
    setShowValues((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SHOW_VALUES, JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const applyCoinsDelta = useCallback((delta: number) => {
    const n = normalizeCoinDelta(delta);
    if (n == null || n === 0) return;
    setProfile((p) => {
      if (!p) return null;
      const base = normalizeCoinDelta(p.coins) ?? 0;
      return { ...p, coins: base + n };
    });
  }, []);

  const contextValue = useMemo(() => ({
    profile,
    isDemo,
    login,
    establishSession,
    logout,
    loadProfile,
    applyCoinsDelta,
    showValues,
    toggleShowValues
  }), [profile, isDemo, login, establishSession, logout, loadProfile, applyCoinsDelta, showValues, toggleShowValues]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
