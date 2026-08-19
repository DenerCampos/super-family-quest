import axios from 'axios';

export type AuthErrorCode =
  | 'EMAIL_ALREADY_EXISTS'
  | 'ACCOUNT_DELETED_REACTIVATION_REQUIRED'
  | 'USER_LIMIT_REACHED';

export function getApiErrorCode(error: unknown): AuthErrorCode | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const code = error.response?.data?.code;
  if (
    code === 'EMAIL_ALREADY_EXISTS' ||
    code === 'ACCOUNT_DELETED_REACTIVATION_REQUIRED' ||
    code === 'USER_LIMIT_REACHED'
  ) {
    return code;
  }

  return null;
}
