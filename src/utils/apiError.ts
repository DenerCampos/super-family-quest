import axios from 'axios';

export type AuthErrorCode =
  | 'EMAIL_ALREADY_EXISTS'
  | 'ACCOUNT_DELETED_REACTIVATION_REQUIRED'
  | 'USER_LIMIT_REACHED'
  | 'INVALID_OR_EXPIRED_RESET_TOKEN'
  | 'INVALID_PASSWORD'
  | 'LAST_FAMILY_GROUP_ADMIN';

export function getApiErrorStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
}

export function getApiErrorCode(error: unknown): AuthErrorCode | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const code = error.response?.data?.code;
  if (
    code === 'EMAIL_ALREADY_EXISTS' ||
    code === 'ACCOUNT_DELETED_REACTIVATION_REQUIRED' ||
    code === 'USER_LIMIT_REACHED' ||
    code === 'INVALID_OR_EXPIRED_RESET_TOKEN' ||
    code === 'INVALID_PASSWORD' ||
    code === 'LAST_FAMILY_GROUP_ADMIN'
  ) {
    return code;
  }

  return null;
}
