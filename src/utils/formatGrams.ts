export function parseGrams(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  const stringValue = String(value);

  // Remove espaços e caracteres indesejados, mas mantém pontos e vírgulas
  const cleanValue = stringValue
    .trim()
    .replace(/[^\d,.-]/g, '') // Remove tudo exceto dígitos, vírgula, ponto e hífen
    .replace(/,/g, '.'); // Substitui vírgulas por pontos para padronizar

  const parsed = parseFloat(cleanValue) || 0;

  // Limita a 3 casas decimais (gramas podem ter precisão de miligramas)
  return Math.round(parsed * 1000) / 1000;
}

export function formatGramsInput(value: string): string {
  if (!value) return '';

  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  // Converte para número e divide por 1000 para ter as 3 casas decimais
  const numericValue = parseInt(digits, 10) / 1000;

  // Formata com 3 casas decimais
  return numericValue.toFixed(3);
}

/**
 * Formata quantidade que já vem pronta da API ou dados externos
 * Diferente do formatGramsInput que é para entrada manual do usuário
 */
export function formatGramsDisplay(value: string | number): string {
  if (!value) return '';

  const numericValue = typeof value === 'number' ? value : parseGrams(value);

  // Formata com até 3 casas decimais, removendo zeros desnecessários
  return numericValue.toFixed(3).replace(/\.?0+$/, '');
}

/** Unidades de contagem inteira (não permite fração tipo 0,011 na quantidade). */
export function isExpenseDiscreteCountUnit(unit: string | undefined): boolean {
  const u = (unit ?? '').trim().toLowerCase();
  return u === 'unidade' || u === 'uni' || u === 'u';
}

const UNIT_ABBREVIATIONS: Record<string, string> = {
  quilogramas: 'kg',
  quilograma: 'kg',
  gramas: 'g',
  grama: 'g',
  miligramas: 'mg',
  miligrama: 'mg',
  toneladas: 't',
  tonelada: 't',
  litros: 'L',
  litro: 'L',
  mililitros: 'ml',
  mililitro: 'ml',
  centilitros: 'cl',
  centilitro: 'cl',
  unidades: 'un',
  unidade: 'un',
  metros: 'm',
  metro: 'm',
  'centímetros': 'cm',
  'centímetro': 'cm',
  'milímetros': 'mm',
  'milímetro': 'mm',
};

/** Retorna a abreviação padronizada de uma unidade de medida. */
export function abbreviateUnit(unit: string): string {
  const normalized = unit.trim().toLowerCase();
  return UNIT_ABBREVIATIONS[normalized] ?? unit;
}

/** Máscara para quantidade inteira (somente dígitos). */
export function formatIntegerQuantityInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const n = parseInt(digits, 10);
  if (!Number.isFinite(n)) return '';
  return String(n);
}
