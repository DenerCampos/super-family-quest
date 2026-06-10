import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesIncomeComparisonQueryKey = {
  root: ['expensesIncomeComparison'] as const,
  list: (year: string, userId: string | undefined) =>
    [...expensesIncomeComparisonQueryKey.root, year, userId ?? 'default'] as const,
};

export function useExpensesIncomeComparison(params: {
  year: string;
  userId?: string;
  enabled?: boolean;
}) {
  const { year, userId, enabled = true } = params;

  return useQuery({
    queryKey: expensesIncomeComparisonQueryKey.list(year, userId),
    queryFn: () => ReportsService.getExpensesIncomeComparison({ year, userId }),
    enabled,
  });
}
