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

export function parseBRLCurrency(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  const stringValue = String(value);

  const cleanValue = stringValue
    .replace(/\./g, '') // Remove pontos
    .replace(/,/g, '.'); // Substitui vírgulas por pontos

  return parseFloat(cleanValue) || 0; // Retorna 0 se não for possível converter
}
