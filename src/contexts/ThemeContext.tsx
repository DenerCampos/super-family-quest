import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ThemeNamespace } from '../i18n/types';
import type { ThemeConfig } from '../services/theme';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

import { api } from '../services';
import { defaultTheme } from '../theme/themes';

interface ThemeContextData {
  currentTheme: ThemeNamespace;
  changeTheme: (theme: ThemeNamespace) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = '@super-family-quest/theme';
const DARK_MODE_STORAGE_KEY = '@super-family-quest/dark-mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado do tema visual
  const [currentTheme, setCurrentTheme] = useState<ThemeNamespace>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeNamespace;
    return saved || 'default';
  });

  // Estado do modo dark/light (inicia como true para dark mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : true; // Mudamos o default para true
  });

  // Função para trocar o tema
  const changeTheme = useCallback((theme: ThemeNamespace) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    setCurrentTheme(theme);
  }, []);

  // Função para trocar o modo dark/light
  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    localStorage.setItem(DARK_MODE_STORAGE_KEY, JSON.stringify(newMode));
    setIsDarkMode(newMode);
  }, [isDarkMode]);

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
      config: {
        initialColorMode: 'dark', // Sempre inicia em dark
        useSystemColorMode: false,
      },
      colors,
      fonts,
      styles: {
        global: (props: { colorMode: 'light' | 'dark' }) => ({
          body: {
            bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          },
        }),
      },
      semanticTokens: {
        colors: {
          'bg.primary': {
            default: colors.primary[50],
            _dark: colors.primary[900],
          },
          'bg.secondary': {
            default: colors.primary[100],
            _dark: colors.primary[800],
          },
          'bg.tertiary': {
            default: colors.primary[200],
            _dark: colors.primary[700],
          },
          'text.primary': {
            default: 'gray.800',
            _dark: 'white',
          },
          'text.secondary': {
            default: 'gray.600',
            _dark: 'gray.300',
          },
          'text.accent': {
            default: colors.primary[500],
            _dark: colors.primary[300],
          },
          'border.primary': {
            default: colors.primary[200],
            _dark: colors.primary[700],
          },
          'border.secondary': {
            default: 'gray.200',
            _dark: 'gray.600',
          },
        },
      },
    });
  }, [currentTheme, isDarkMode, availableThemes]);

  const contextValue = useMemo(() => ({
    currentTheme,
    changeTheme,
    isDarkMode,
    toggleDarkMode
  }), [currentTheme, changeTheme, isDarkMode, toggleDarkMode]);



  return (
    <ThemeContext.Provider value={contextValue}>
      <ColorModeScript initialColorMode={isDarkMode ? 'dark' : 'light'} />
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext }; 