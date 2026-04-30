/** Converte valores vindos da API (number/string) em número finito ou null. */
export function toFiniteCoins(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const n = Number(trimmed.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Coins explícitos na resposta (incl. 0) são respeitados; `null`/`undefined`/ausente
 * usam o fallback (ex.: defaults 5/10).
 */
export function coinDeltaFromApi(raw: unknown, whenMissing: number): number {
  if (raw === undefined || raw === null) return whenMissing;
  const n = toFiniteCoins(raw);
  return n !== null ? n : whenMissing;
}

/** Garante número finito para operações (evita concatenação string + number). */
export function normalizeCoinDelta(delta: unknown): number | null {
  return toFiniteCoins(delta);
}

/** Após navegação (ex.: formulário sem Header), espera o próximo paint para o alvo da moeda existir. */
export function runAfterNextPaint(fn: () => void): void {
  queueMicrotask(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(fn);
    });
  });
}
