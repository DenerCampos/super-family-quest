import {
  HEALTH_PROCESSING_AUTO_RETRY_AFTER_HOURS,
  HEALTH_PROCESSING_AUTO_RETRY_AFTER_MS,
} from './healthProcessingConstants';

export function getNextAutoRetryAt(failedAt?: string | null): Date | null {
  if (!failedAt) return null;
  const failedTime = new Date(failedAt).getTime();
  if (Number.isNaN(failedTime)) return null;
  return new Date(failedTime + HEALTH_PROCESSING_AUTO_RETRY_AFTER_MS);
}

export function formatAutoRetryRemaining(
  failedAt: string | null | undefined,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  const nextRetry = getNextAutoRetryAt(failedAt);
  if (!nextRetry) {
    return t('health.pending.processingFailedRetryHint', {
      hours: HEALTH_PROCESSING_AUTO_RETRY_AFTER_HOURS,
    });
  }

  const remainingMs = nextRetry.getTime() - Date.now();
  if (remainingMs <= 0) {
    return t('health.pending.processingFailedRetrySoon');
  }

  const totalMinutes = Math.ceil(remainingMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return t('health.pending.processingFailedRetryCountdownHoursMinutes', {
      hours,
      minutes,
    });
  }
  if (hours > 0) {
    return t('health.pending.processingFailedRetryCountdownHours', { hours });
  }
  return t('health.pending.processingFailedRetryCountdownMinutes', { minutes });
}
