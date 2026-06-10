export const financialQueryKeys = {
  receipt: (type: 'expense' | 'revenue' | undefined, id: string | undefined) =>
    ['financial-receipt', type, id] as const,
};
