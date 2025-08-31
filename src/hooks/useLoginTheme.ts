import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const useLoginTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    try {
      // Verifica se há um tema salvo no localStorage
      const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_THEME);
      if (savedTheme) {
        const { themeId } = JSON.parse(savedTheme);
        // Na tela de login, apenas usamos o último tema salvo, independente do usuário
        if (themeId === 'default' || themeId === 'rpg') {
          setCurrentTheme(themeId);
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tema do login:', error);
    }

    // Se não houver tema salvo ou houver erro, usa o tema default
    setCurrentTheme('default');
  }, []);

  return currentTheme;
};
