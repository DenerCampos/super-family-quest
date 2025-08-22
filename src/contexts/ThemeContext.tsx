import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ThemeNamespace } from '../i18n/types';
import type { ThemeConfig } from '../services/theme';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { api } from '../services';
import { defaultTheme } from '../theme/themes';

interface ThemeContextData {
  currentTheme: ThemeNamespace;
  changeTheme: (theme: ThemeNamespace) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = '@super-family-quest/theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado do tema visual
  const [currentTheme, setCurrentTheme] = useState<ThemeNamespace>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeNamespace;
    return saved || 'default';
  });

  // Função para trocar o tema
  const changeTheme = useCallback((theme: ThemeNamespace) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    setCurrentTheme(theme);
  }, []);

  // Estado para armazenar os temas disponíveis
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([{
    id: 'default',
    name: 'Modo Padrão',
    theme: defaultTheme,
    isUnlocked: true,
  }]);

  // Carrega os temas disponíveis
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const themes = await api.getAvailableThemes();
        setAvailableThemes(themes);
      } catch (error) {
        console.error('Erro ao carregar temas:', error);
        // Em caso de erro, mantém apenas o tema default
        setAvailableThemes([{
          id: 'default',
          name: 'Modo Padrão',
          theme: defaultTheme,
          isUnlocked: true,
        }]);
        // Se o tema atual não for o default, muda para ele
        if (currentTheme !== 'default') {
          setCurrentTheme('default');
          localStorage.setItem(THEME_STORAGE_KEY, 'default');
        }
      }
    };

    loadThemes();
  }, [currentTheme]);

  // Configuração do tema do Chakra
  const theme = useMemo(() => {
    const themeConfig = availableThemes.find(t => t.id === currentTheme) || availableThemes[0];
    const { colors, fonts } = themeConfig.theme;

    return extendTheme({
      colors,
      fonts,
      styles: {
        global: {
          body: {
            bg: colors.background.primary,
            color: colors.text.primary,
          },
        },
      },
    });
  }, [currentTheme, availableThemes]);

  const contextValue = useMemo(() => ({
    currentTheme,
    changeTheme,
  }), [currentTheme, changeTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };