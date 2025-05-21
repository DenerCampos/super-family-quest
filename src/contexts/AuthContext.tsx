import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services';

export type UserProfile = {
  email: string;
  name: string;
  family: string;
  income: number;
  expenses: number;
  coins: number;
  coatOfArms: string;
};

type AuthContextType = {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const loadProfile = async () => {   
    try {
      const profile = await api.profile();
      setUser((prev) => ({
        ...prev,
        ...profile,
      }));
    } catch (error) {
      console.error('Failed to load profile:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { accessToken } = await api.login({ email, password });
      await loadProfile();

      localStorage.setItem('accessToken', accessToken);

      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
