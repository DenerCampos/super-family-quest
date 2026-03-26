import { useEffect } from 'react';
import { useVisualTheme } from './useVisualTheme';
import { resolveChakraColor } from '../utils/resolveColor';

/**
 * Keeps the <meta name="theme-color"> tag in sync with the active visual theme.
 * This controls the browser address bar / status bar color on mobile.
 */
export function useThemeColor() {
  const { theme } = useVisualTheme();
  const headerColor = theme.colors.background.header;

  useEffect(() => {
    const hex = resolveChakraColor(headerColor);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', hex);
    }
  }, [headerColor]);
}
