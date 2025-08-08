import { useTheme } from '../contexts/ThemeContext';
import { useThemeTranslation } from './useThemeTranslation';

export function useThemedTranslation() {
  const { currentTheme } = useTheme();
  const { t, changeTheme } = useThemeTranslation(currentTheme);

  return { t, currentTheme, changeTheme };
} 