import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesByGroupQueryKey = {
  root: ['expensesByGroup'] as const,
  list: (startDate: string, endDate: string, userId: string | undefined) =>
    [...expensesByGroupQueryKey.root, startDate, endDate, userId ?? 'default'] as const,
};

export function useExpensesByGroup(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, enabled = true } = params;

  return useQuery({
    queryKey: expensesByGroupQueryKey.list(startDate, endDate, userId),
    queryFn: () =>
      ReportsService.getExpenseByGroup({ startDate, endDate, userId }),
    enabled,
  });
}
