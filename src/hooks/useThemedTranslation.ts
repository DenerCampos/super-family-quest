import { ThemeContext } from '../contexts/ThemeContext';
import { useContext } from 'react';
import { useThemeTranslation } from './useThemeTranslation';

export function useThemedTranslation() {
  const { currentTheme } = useContext(ThemeContext);
  const { t, changeTheme } = useThemeTranslation(currentTheme);

  return { t, changeTheme };  
} 