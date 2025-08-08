import { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeNamespace } from '../i18n/types';
import { useThemeTranslation } from '../hooks/useThemeTranslation';

const LOCAL_STORAGE_KEYS = {
  THEME: '@super-family-quest/theme',
};

interface ThemeContextData {
  currentTheme: ThemeNamespace;
  changeTheme: (theme: ThemeNamespace) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeNamespace>(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return (savedTheme as ThemeNamespace) || 'default';
  });

  const { changeTheme: i18nChangeTheme } = useThemeTranslation(currentTheme);

  const changeTheme = (theme: ThemeNamespace) => {
    if (theme !== currentTheme) {
      setCurrentTheme(theme);
      i18nChangeTheme(theme);
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
    }
  };

  // Aplica o tema inicial
  useEffect(() => {
    i18nChangeTheme(currentTheme);
  }, [currentTheme, i18nChangeTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
} 