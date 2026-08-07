import { LOCAL_STORAGE_KEYS } from './constants';

type JwtPayload = {
  isDemo?: boolean;
  sub?: string;
  exp?: number;
};

/**
 * Lê o payload do JWT no localStorage (sem validar assinatura — só UX).
 * A proteção real está na API (`DenyDemoGuard`).
 */
export function readAccessTokenPayload(): JwtPayload | null {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isDemoSession(): boolean {
  return readAccessTokenPayload()?.isDemo === true;
}
