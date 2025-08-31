import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const useInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_THEME);
    if (savedTheme) {
      const { themeId, timestamp } = JSON.parse(savedTheme);
      // Verifica se o tema salvo não é muito antigo (24 horas)
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return themeId;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar tema inicial:', error);
  }
  return 'default';
};
