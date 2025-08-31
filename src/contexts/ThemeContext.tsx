import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ThemeConfig } from '../services/theme';

import { api } from '../services';

import { useAuth } from './AuthContext';



interface ThemeContextData {
  currentTheme: string;
  changeTheme: (themeId: string) => void;
  availableThemes: ThemeConfig[];
  isLoadingThemes: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const userId = profile?.user?.id;

  // Se não houver userId, renderiza apenas as crianças sem tema
  if (!userId) {

    return <>{children}</>;
  }

  // Força remontagem do provider quando o usuário muda
  return <ThemeProviderContent key={userId}>{children}</ThemeProviderContent>;
};

const ThemeProviderContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const userId = profile?.user?.id;


  // Estado do tema visual
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  // Estado para armazenar os temas disponíveis
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

  // Limpa o estado quando não há perfil
  const resetThemeState = useCallback(() => {
    setCurrentTheme('default');
    setAvailableThemes([]);
    setIsLoadingThemes(false);
  }, []);

  // Estado para armazenar o ID do tema ativo no backend
  // const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  // Função para trocar o tema
  const changeTheme = useCallback(async (themeId: string) => {
    try {
      await api.changeTheme(themeId);
      
      const activeTheme = await api.getActiveTheme();
      
      if (activeTheme) {
        setCurrentTheme(activeTheme.theme);
      }
    } catch (error) {
      console.error('Erro ao trocar tema:', error);
    }
  }, []);

  // Carrega os temas disponíveis
  useEffect(() => {
    const loadThemes = async () => {
      setIsLoadingThemes(true);
      
      if (!userId) {
        resetThemeState();
        return;
      }

      try {
        // Busca apenas os temas que o usuário tem acesso
        const activeTheme = await api.getActiveTheme();
        const unlockedThemes = await api.getAllowedThemes();

        setAvailableThemes(unlockedThemes);

        if (activeTheme) {
          setCurrentTheme(activeTheme.theme);
        }
      } catch (error) {
        console.error('Erro ao carregar temas:', error);
        resetThemeState();
      } finally {
        setIsLoadingThemes(false);
      }
    };

    loadThemes();
  }, [userId, resetThemeState]); // Recarrega os temas quando o ID do usuário mudar

  const contextValue = useMemo(() => ({
    currentTheme,
    changeTheme,
    availableThemes,
    isLoadingThemes
  }), [currentTheme, changeTheme, availableThemes, isLoadingThemes]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };