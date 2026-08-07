/** Aceita apenas paths internos do app (relative, sem protocol-relative). */
export function isSafeAppPath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}
