import React, { createContext, useContext, useState } from 'react';
import type { ThemeNamespace } from '../i18n/types';
import { ChakraProvider } from '@chakra-ui/react';
import { useThemedTranslation } from '../hooks/useThemedTranslation';

interface ThemeContextData {
  currentTheme: ThemeNamespace;
  changeTheme: (theme: ThemeNamespace) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const LOCAL_STORAGE_KEY = '@super-family-quest/theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeNamespace>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeNamespace;
    return saved || 'default';
  });

  const { changeTheme: i18nChangeTheme } = useThemedTranslation();

  const changeTheme = (theme: ThemeNamespace) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    setCurrentTheme(theme);
    i18nChangeTheme(theme); // Sincroniza o tema de texto
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 