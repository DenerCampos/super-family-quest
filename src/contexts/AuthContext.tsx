import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export type User = {
  id: string;
  email: string;
  name: string;
  family: string;
  coatOfArms: string;
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  showValues: boolean;
  toggleShowValues: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showValues, setShowValues] = useState(() => {
    const savedShowValues = localStorage.getItem(LOCAL_STORAGE_KEYS.SHOW_VALUES);
    return savedShowValues ? JSON.parse(savedShowValues) : true;
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !profile) {
      loadProfile().catch(() => {
        localStorage.removeItem('accessToken');
        navigate('/login');
      });
    }
  }, [profile, navigate]);

  const loadProfile = useCallback(async () => {   
    try {
      const profile = await api.profile();
      
      setProfile(profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      throw error;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { accessToken } = await api.login({ email, password });
      localStorage.setItem('accessToken', accessToken);
      
      await loadProfile();

      // Garante que o state foi atualizado antes de navegar
      setTimeout(() => navigate('/home'), 0);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [loadProfile, navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setProfile(null);
    navigate('/login');
  }, [navigate]);

  const toggleShowValues = useCallback(() => {
    setShowValues((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SHOW_VALUES, JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const contextValue = useMemo(() => ({
    profile,
    login,
    logout,
    loadProfile,
    showValues,
    toggleShowValues
  }), [profile, login, logout, loadProfile, showValues, toggleShowValues]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
