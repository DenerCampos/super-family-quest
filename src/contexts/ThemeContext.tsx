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
  isThemeLoaded: boolean;
  reloadThemes: () => Promise<void>;
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
  // Inicializa com o tema salvo no localStorage ou default
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    try {
      const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_THEME);
      if (savedTheme) {
        const { themeId } = JSON.parse(savedTheme);
        if (themeId === 'default' || themeId === 'rpg') {
          return themeId;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tema inicial:', error);
    }
    return 'default';
  });

  // Estado para armazenar os temas disponíveis
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Limpa o estado quando não há perfil
  const resetThemeState = useCallback(() => {
    setCurrentTheme('default');
    setAvailableThemes([]);
    setIsLoadingThemes(false);
    setIsThemeLoaded(false);
    // Limpa o tema salvo no localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_THEME);
  }, []);

  // Estado para armazenar o ID do tema ativo no backend
  // const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  // Função para trocar o tema
  const saveUserTheme = useCallback((userId: string, themeId: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_THEME, JSON.stringify({ 
      userId, 
      themeId,
      timestamp: Date.now() // Adicionamos um timestamp para validação
    }));
  }, []);

  const changeTheme = useCallback(async (themeId: string) => {
    try {
      // Encontra o tema pelo ID (UUID)
      const theme = availableThemes.find(t => t.id === themeId);
      if (!theme) {
        console.error('Tema não encontrado:', themeId);
        return;
      }

      await api.changeTheme(theme.id);
      
      // Recarrega os temas para ter certeza que temos os dados mais atuais
      const [activeTheme, unlockedThemes] = await Promise.all([
        api.getActiveTheme(),
        api.getAllowedThemes()
      ]);
      
      setAvailableThemes(unlockedThemes);
      
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

  // Função para carregar os temas
  const loadThemes = useCallback(async () => {
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
          saveUserTheme(userId, themeId);
          setIsThemeLoaded(true);
          return;
        }
      }

      // Se não houver tema salvo ou válido, usa o tema ativo
      if (activeTheme) {
        setCurrentTheme(activeTheme.theme);
        saveUserTheme(userId, activeTheme.theme);
        setIsThemeLoaded(true);
      }
    } catch (error) {
      console.error('Erro ao carregar temas:', error);
      resetThemeState();
    } finally {
      setIsLoadingThemes(false);
    }
  }, [userId, resetThemeState, saveUserTheme]);

  // Carrega os temas quando o componente monta ou o usuário muda
  useEffect(() => {
    loadThemes();
  }, [loadThemes]); // Recarrega os temas quando o ID do usuário mudar

  const contextValue = useMemo(() => ({
    currentTheme,
    changeTheme,
    availableThemes,
    isLoadingThemes,
    isThemeLoaded,
    reloadThemes: loadThemes
  }), [currentTheme, changeTheme, availableThemes, isLoadingThemes, isThemeLoaded, loadThemes]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div data-theme-loaded={isThemeLoaded}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };