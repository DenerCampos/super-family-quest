import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ThemeConfig } from '../services/theme';

import { api } from '../services';
import { useAuth } from './AuthContext';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';



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
  const saveUserTheme = useCallback((userId: string, themeId: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_THEME, JSON.stringify({ userId, themeId }));
  }, []);

  const changeTheme = useCallback(async (themeId: string) => {
    try {
      // Encontra o tema pelo tipo (rpg/default)
      const theme = availableThemes.find(t => t.theme === themeId);
      if (!theme) {
        console.error('Tema não encontrado:', themeId);
        return;
      }

      await api.changeTheme(theme.id);
      
      const activeTheme = await api.getActiveTheme();
      
      if (activeTheme) {
        setCurrentTheme(activeTheme.theme);
        if (userId) {
          saveUserTheme(userId, activeTheme.theme);
        }
      }
    } catch (error) {
      console.error('Erro ao trocar tema:', error);
    }
  }, [userId, saveUserTheme, availableThemes]);

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
        const [activeTheme, unlockedThemes] = await Promise.all([
          api.getActiveTheme(),
          api.getAllowedThemes()
        ]);

        setAvailableThemes(unlockedThemes);

        // Verifica se há um tema salvo no localStorage para este usuário
        const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_THEME);
        if (savedTheme) {
          const { userId: savedUserId, themeId } = JSON.parse(savedTheme);
          
          // Verifica se o tema salvo pertence ao usuário atual e está disponível
          // Encontra o tema pelo tipo (rpg/default)
          const savedThemeConfig = unlockedThemes.find(theme => theme.theme === themeId);
          if (savedUserId === userId && savedThemeConfig) {
            setCurrentTheme(themeId);
            return;
          }
        }

        // Se não houver tema salvo ou válido, usa o tema ativo
        if (activeTheme) {
          setCurrentTheme(activeTheme.theme);
          saveUserTheme(userId, activeTheme.theme);
        }
      } catch (error) {
        console.error('Erro ao carregar temas:', error);
        resetThemeState();
      } finally {
        setIsLoadingThemes(false);
      }
    };

    loadThemes();
  }, [userId, resetThemeState, saveUserTheme]); // Recarrega os temas quando o ID do usuário mudar

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