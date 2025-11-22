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
