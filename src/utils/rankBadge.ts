import type { useVisualTheme } from '../hooks/useVisualTheme';

/**
 * Returns the badge background color for a ranking position.
 * Uses semantic theme tokens so the color adapts between themes.
 */
export function getRankBadgeColor(
  rank: number,
  getColor: ReturnType<typeof useVisualTheme>['getColor'],
): string {
  if (rank === 1) return getColor('status.rank.gold');
  if (rank === 2) return getColor('status.rank.silver');
  if (rank === 3) return getColor('status.rank.bronze');
  return getColor('border.dashboard.tileActive');
}
