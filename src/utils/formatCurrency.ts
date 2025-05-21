export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function formatCurrencyBRL(value: string): string {
  const cleanValue = value.toString().replace(/\D/g, '');

  if (!cleanValue || cleanValue === '0') {
    return '0,00';
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
