import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const AUTH_PATHS_IGNORE_401 = ['/auth/login', '/auth/demo', '/auth/oauth/login'];

let unauthorizedHandler: (() => void) | null = null;
let handlingUnauthorized = false;

export function registerUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function unregisterUnauthorizedHandler(): void {
  unauthorizedHandler = null;
}

function shouldIgnoreUnauthorized(url?: string): boolean {
  if (!url) return false;
  return AUTH_PATHS_IGNORE_401.some((path) => url.includes(path));
}

export function handleUnauthorizedResponse(requestUrl?: string): void {
  if (shouldIgnoreUnauthorized(requestUrl)) return;
  if (handlingUnauthorized) return;

  handlingUnauthorized = true;
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  if (unauthorizedHandler) {
    unauthorizedHandler();
  } else {
    window.location.assign('/login');
  }

  window.setTimeout(() => {
    handlingUnauthorized = false;
  }, 1000);
}
