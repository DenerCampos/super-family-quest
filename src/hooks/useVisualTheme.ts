import { useTheme } from './useThemeContext';
import { defaultTheme, rpgTheme } from '../theme/themes';

export function useVisualTheme() {
  const { currentTheme, isDarkMode } = useTheme();
  const theme = currentTheme === 'rpg' ? rpgTheme : defaultTheme;

  const getAsset = (path: string) => {
    if (!theme) return '';
    
    // Divide o caminho em partes
    const parts = path.split('.');
    
    // Navega através do objeto de assets
    let current = theme.assets as unknown as Record<string, unknown>;
    for (const part of parts) {
      if (typeof current !== 'object' || !current[part]) return '';
      current = current[part] as Record<string, unknown>;
    }
    
    return typeof current === 'string' ? current : '';
  };

  const getColor = (path: string): string => {
    if (!theme) return '';
    
    // Divide o caminho em partes
    const parts = path.split('.');
    
    // Navega através do objeto de cores
    let current = theme.colors as unknown as Record<string, unknown>;
    for (const part of parts) {
      if (typeof current !== 'object' || !current[part]) return '';
      current = current[part] as Record<string, unknown>;
    }
    
    // Se o valor é um objeto com light/dark, retorna o valor apropriado
    if (typeof current === 'object' && 'light' in current && 'dark' in current) {
      const colorObj = current as { light: string; dark: string };
      return isDarkMode ? colorObj.dark : colorObj.light;
    }
    
    return typeof current === 'string' ? current : '';
  };

  const getFont = (type: 'body' | 'heading' | 'mono' | 'theme') => {
    if (!theme) return '';
    return theme.fonts[type];
  };

  return {
    theme,
    getAsset,
    getColor,
    getFont,
  };
} 