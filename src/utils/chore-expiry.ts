import type { ChoreOccurrenceResponseDto } from '../types/chore';

/** In-progress cards that should be highlighted and sorted first (see chores plan). */
export function isChoreOccurrenceExpiring(
  occ: ChoreOccurrenceResponseDto,
): boolean {
  if (!occ.createdAt) return false;
  const r = occ.definition.recurrence;
  if (r === 'daily') return true;
  if (r === 'weekly') {
    const created = new Date(occ.createdAt);
    const deadline = new Date(created);
    deadline.setDate(deadline.getDate() + 6);
    return new Date() >= deadline;
  }
  return false;
}
