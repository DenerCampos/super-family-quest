import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services';

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
  const [showValues, setShowValues] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !profile) {
      loadProfile().catch(() => {
        localStorage.removeItem('accessToken');
        navigate('/login');
      });
    }
  }, []);

  const loadProfile = async () => {   
    try {
      const profile = await api.profile();
      
      setProfile((prev) => ({
        ...prev,
        ...profile,
      }));
    } catch (error) {
      console.error('Failed to load profile:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { accessToken } = await api.login({ email, password });
      localStorage.setItem('accessToken', accessToken);
      
      await loadProfile();

      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setProfile(null);
    navigate('/login');
  };

  const toggleShowValues = () => {
    setShowValues(prev => !prev);
  };

  return (
    <AuthContext.Provider value={{ profile, login, logout, loadProfile, showValues, toggleShowValues }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
