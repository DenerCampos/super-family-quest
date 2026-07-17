export type ParsedReferenceRange = {
  min: number | null;
  max: number | null;
};

/**
 * Converte valores laboratoriais (texto) para número.
 * Aceita formatos BR (`280.000`, `4,5`) e US (`280000`, `4.5`).
 * Retorna null para resultados qualitativos (NEGATIVO, REAGENTE, etc.).
 */
export function parseHealthResultValue(
  raw: string | null | undefined,
): number | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Remove unidades/sufixos comuns colados ao número
  const withoutUnit = trimmed.replace(/[^\d.,\-+\s].*$/, '').trim();
  if (!withoutUnit) return null;

  const normalized = normalizeNumericString(withoutUnit);
  if (normalized == null) return null;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function normalizeNumericString(input: string): string | null {
  const cleaned = input.replace(/\s/g, '');
  if (!/^[-+]?\d{1,3}([.,]\d{3})*([.,]\d+)?$|^[-+]?\d+([.,]\d+)?$/.test(cleaned)) {
    return null;
  }

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  // Ambos separadores: o último é decimal
  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      // 1.234,56
      return cleaned.replace(/\./g, '').replace(',', '.');
    }
    // 1,234.56
    return cleaned.replace(/,/g, '');
  }

  if (lastComma >= 0) {
    const decimals = cleaned.length - lastComma - 1;
    // 4,5 ou 280,000 (3 dígitos após vírgula = milhar BR só se houver mais de um grupo)
    if (decimals === 3 && cleaned.indexOf(',') === lastComma) {
      const before = cleaned.slice(0, lastComma).replace(/[-+]/, '');
      // Se a parte inteira tem 1–3 dígitos e exatamente 3 após, pode ser milhar (280,000) ou decimal raro
      // Heurística BR: milhar quando há ponto ausente e parte antes tem length > 0 with groups
      if (/^\d{1,3}$/.test(before) && before.length <= 3) {
        // Preferir milhar apenas se valor sem vírgula parece milhar típico (ex.: 280.000 estilo com vírgula)
        // Na prática BR usa ponto para milhar; vírgula+3 dígitos costuma ser decimal em alguns labs.
        return cleaned.replace(',', '.');
      }
    }
    return cleaned.replace(/\./g, '').replace(',', '.');
  }

  if (lastDot >= 0) {
    const decimals = cleaned.length - lastDot - 1;
    // 280.000 → milhar BR
    if (decimals === 3) {
      const parts = cleaned.split('.');
      const allGroupsOk = parts.slice(1).every((p) => p.length === 3);
      if (allGroupsOk && parts[0].replace(/[-+]/, '').length <= 3) {
        return cleaned.replace(/\./g, '');
      }
    }
    return cleaned.replace(/,/g, '');
  }

  return cleaned;
}

/**
 * Extrai faixa numérica de textos como "4.000 A 11.000/mm3", "150000-450000", "< 10".
 */
export function parseReferenceRange(
  raw: string | null | undefined,
): ParsedReferenceRange | null {
  if (raw == null) return null;
  const text = raw.trim();
  if (!text) return null;

  const lower = text.toLowerCase();

  const between =
    text.match(
      /([\d.,]+)\s*(?:a|–|-|—|até|ate)\s*([\d.,]+)/i,
    ) ?? null;
  if (between) {
    const min = parseHealthResultValue(between[1]);
    const max = parseHealthResultValue(between[2]);
    if (min == null && max == null) return null;
    return { min, max };
  }

  const less = text.match(/[<>]=?\s*([\d.,]+)/);
  if (less) {
    const value = parseHealthResultValue(less[1]);
    if (value == null) return null;
    if (text.includes('<')) return { min: null, max: value };
    if (text.includes('>')) return { min: value, max: null };
  }

  // Faixas só texto (NEGATIVO etc.)
  if (/[a-zA-ZÀ-ÿ]/.test(lower) && !/\d/.test(lower)) {
    return null;
  }

  return null;
}
