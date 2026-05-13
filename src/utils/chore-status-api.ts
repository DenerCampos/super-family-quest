import type {
  ChoreOccurrenceQueryStatusSnake,
  ChoreOccurrenceStatusApi,
} from '../types/chore';

export const CHORE_OCCURRENCE_STATUSES: readonly ChoreOccurrenceStatusApi[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_APPROVAL',
  'COMPLETED',
  'REJECTED',
] as const;

export function isChoreOccurrenceStatusApi(
  value: string,
): value is ChoreOccurrenceStatusApi {
  return (CHORE_OCCURRENCE_STATUSES as readonly string[]).includes(value);
}

export const CHORE_QUERY_STATUS_SNAKE: readonly ChoreOccurrenceQueryStatusSnake[] =
  ['open', 'waiting_approval', 'completed'] as const;

export function isChoreQueryStatusSnake(
  value: string,
): value is ChoreOccurrenceQueryStatusSnake {
  return (CHORE_QUERY_STATUS_SNAKE as readonly string[]).includes(value);
}
