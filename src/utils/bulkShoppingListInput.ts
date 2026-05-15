/**
 * Detecta entrada em lote: vírgula usada como separador entre itens (vírgula seguida de espaço).
 * Evita falso positivo em valores decimais como "2,5 kg de arroz".
 */
export function isBulkShoppingListInput(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.includes(',')) return false;
  const segments = trimmed.split(/\s*,\s+/).filter((s) => s.length > 0);
  return segments.length >= 2;
}
