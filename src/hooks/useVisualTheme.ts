import { useTheme } from '../contexts/ThemeContext';
import { defaultTheme, rpgTheme } from '../theme/themes';

export function useVisualTheme() {
  const { currentTheme } = useTheme();
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

  const getColor = (path: string) => {
    if (!theme) return '';
    
    // Divide o caminho em partes
    const parts = path.split('.');
    
    // Navega através do objeto de cores
    let current = theme.colors as unknown as Record<string, unknown>;
    for (const part of parts) {
      if (typeof current !== 'object' || !current[part]) return '';
      current = current[part] as Record<string, unknown>;
    }
    
    return typeof current === 'string' ? current : '';
  };

  const getFont = (type: 'body' | 'heading' | 'mono') => {
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