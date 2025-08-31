import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeNamespace } from '../i18n/types';
import { useContext } from 'react';
import { useThemeTranslation } from './useThemeTranslation';

export function useThemedTranslation() {
  const { currentTheme } = useContext(ThemeContext) as { currentTheme: ThemeNamespace };
  const { t, changeTheme } = useThemeTranslation(currentTheme);

  return { t, changeTheme };  
} 