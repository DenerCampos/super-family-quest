import { chakraColors } from '../theme/themes';

type ColorScale = Record<number, string>;

const colorMap: Record<string, ColorScale> = chakraColors;

/**
 * Resolves a Chakra UI color token (e.g. 'blue.800') to its hex value.
 * Returns the original string if it's already a raw color (hex, rgb, etc).
 */
/**
 * Appends an alpha hex suffix (e.g. '33' = 20%) to a 6-digit hex color.
 * Returns the original color unchanged if it is not a standard 6-digit hex.
 */
export function withAlpha(hexColor: string, alphaHex: string): string {
  if (hexColor.startsWith('#') && hexColor.length === 7) {
    return `${hexColor}${alphaHex}`;
  }
  return hexColor;
}

export function resolveChakraColor(token: string): string {
  if (token.startsWith('#') || token.startsWith('rgb')) return token;

  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return token;

  const colorName = token.slice(0, dotIndex);
  const shade = Number(token.slice(dotIndex + 1));

  return colorMap[colorName]?.[shade] ?? token;
}
