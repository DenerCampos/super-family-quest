export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function formatCurrencyBRL(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return '0,00';
  }

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Para input com máscara (digitação do usuário)
export function formatCurrencyInputBRL(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  
  if (!cleanValue) {
    return '';
  }
  
  const numericValue = parseInt(cleanValue, 10) / 100;
  
  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Valor inicial da máscara a partir de um número (API). */
export function numberToBRLCurrencyInputValue(n: number): string {
  const cents = Math.round((Number(n) || 0) * 100);
  return formatCurrencyInputBRL(String(cents));
}

/**
 * Converte texto em número (real). Aceita:
 * - Brasileiro: vírgula decimal e ponto como milhar (ex.: "1.234,56").
 * - Ponto apenas como decimal (ex.: "2.00"), evitando 2 virar 200.
 * - Saída de formatCurrencyInputBRL (somente dígitos internos viram "10,99").
 */
export function parseBRLCurrency(value: string | number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const stringValue = String(value).trim();
  if (!stringValue) {
    return 0;
  }

  // Notação brasileira típica: vírgula é o decimal; pontos são separadores de milhar
  if (stringValue.includes(',')) {
    const normalized = stringValue.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  const compact = stringValue.replace(/\s/g, '');
  const dotParts = compact.split('.');

  // Um único ponto com até 2 casas na parte direita ⇒ decimal inglês/teclado (ex.: "2.00", "12.5")
  if (
    dotParts.length === 2 &&
    dotParts[1].length > 0 &&
    dotParts[1].length <= 2
  ) {
    const n = parseFloat(compact);
    return Number.isFinite(n) ? n : 0;
  }

  // Vários pontos ou "X.YYY" ⇒ milhares brasileiros sem vírgula (ex.: "1.000", "12.345.678")
  if (dotParts.length > 1) {
    const n = parseFloat(compact.replace(/\./g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  const n = parseFloat(compact);
  return Number.isFinite(n) ? n : 0;
}
