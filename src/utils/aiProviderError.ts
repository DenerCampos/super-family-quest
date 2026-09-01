import { isAxiosError } from 'axios';

export const AI_PROVIDER_ERROR_CODE = 'AI_PROVIDER_ERROR';
export const CHAT_AI_PROVIDER_ERROR_CODE = 'CHAT_AI_PROVIDER_ERROR';
export const AI_QUOTA_ERROR_CODE = 'API Quota Exceeded';

export const AI_PROVIDER_ERROR_EVENT = 'sfq:ai-provider-error';
export const AI_QUOTA_ERROR_EVENT = 'sfq:ai-quota-error';

export const AI_PROVIDER_TOAST_ID = 'ai-provider-error';
export const AI_QUOTA_TOAST_ID = 'ai-quota-error';

export type AiErrorI18nKey = 'common.aiProviderError' | 'common.aiQuotaError';

function getAxiosErrorCode(err: unknown): string | undefined {
  if (!isAxiosError(err)) return undefined;
  const data = err.response?.data as { error?: string } | undefined;
  return data?.error;
}

export function isAiProviderError(err: unknown): boolean {
  const code = getAxiosErrorCode(err);
  return (
    code === AI_PROVIDER_ERROR_CODE || code === CHAT_AI_PROVIDER_ERROR_CODE
  );
}

export function isAiQuotaError(err: unknown): boolean {
  if (!isAxiosError(err)) return false;
  return (
    err.response?.status === 429 && getAxiosErrorCode(err) === AI_QUOTA_ERROR_CODE
  );
}

export function getAiErrorI18nKey(err: unknown): AiErrorI18nKey | null {
  if (isAiQuotaError(err)) return 'common.aiQuotaError';
  if (isAiProviderError(err)) return 'common.aiProviderError';
  return null;
}

export function resolveAiErrorMessage(
  err: unknown,
  t: (key: string) => string,
  fallbackKey: string,
): string {
  return t(getAiErrorI18nKey(err) ?? fallbackKey);
}

export function emitAiProviderError(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AI_PROVIDER_ERROR_EVENT));
}

export function emitAiErrorEvents(err: unknown): void {
  if (typeof window === 'undefined') return;
  if (isAiQuotaError(err)) {
    window.dispatchEvent(new CustomEvent(AI_QUOTA_ERROR_EVENT));
    return;
  }
  if (isAiProviderError(err)) {
    emitAiProviderError();
  }
}
