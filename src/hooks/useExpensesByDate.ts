import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesByDateQueryKey = {
  root: ['expensesByDate'] as const,
  list: (startDate: string, endDate: string, userId: string | undefined) =>
    [...expensesByDateQueryKey.root, startDate, endDate, userId ?? 'default'] as const,
};

export function useExpensesByDate(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, enabled = true } = params;

  return useQuery({
    queryKey: expensesByDateQueryKey.list(startDate, endDate, userId),
    queryFn: () => ReportsService.getExpenseByDate({ startDate, endDate, userId }),
    enabled,
  });
}
