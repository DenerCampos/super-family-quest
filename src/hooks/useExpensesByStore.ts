import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesByStoreQueryKey = {
  root: ['expensesByStore'] as const,
  list: (startDate: string, endDate: string, userId: string | undefined) =>
    [...expensesByStoreQueryKey.root, startDate, endDate, userId ?? 'default'] as const,
};

export function useExpensesByStore(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, enabled = true } = params;

  return useQuery({
    queryKey: expensesByStoreQueryKey.list(startDate, endDate, userId),
    queryFn: () =>
      ReportsService.getExpenseByStore({ startDate, endDate, userId }),
    enabled,
  });
}
