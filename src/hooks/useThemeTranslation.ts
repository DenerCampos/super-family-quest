import { useTranslation } from 'react-i18next';
import type { ThemeNamespace } from '../i18n/types';

export function useThemeTranslation(themeNamespace: ThemeNamespace = 'default') {
  const { t, i18n } = useTranslation(themeNamespace);

  const changeTheme = (newTheme: ThemeNamespace) => {
    i18n.setDefaultNamespace(newTheme);
    // Força a recarregar as traduções com o novo namespace
    i18n.reloadResources('pt', newTheme);
  };

  return {
    t,
    changeTheme,
    currentTheme: i18n.options.defaultNS as ThemeNamespace,
  };
} 