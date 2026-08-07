import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesIncomeComparisonQueryKey = {
  root: ['expensesIncomeComparison'] as const,
  list: (
    year: string,
    userId: string | undefined,
    familyGroupId: string | undefined,
  ) =>
    [
      ...expensesIncomeComparisonQueryKey.root,
      year,
      userId ?? 'default',
      familyGroupId ?? 'none',
    ] as const,
};

export function useExpensesIncomeComparison(params: {
  year: string;
  userId?: string;
  familyGroupId?: string;
  enabled?: boolean;
}) {
  const { year, userId, familyGroupId, enabled = true } = params;

  return useQuery({
    queryKey: expensesIncomeComparisonQueryKey.list(
      year,
      userId,
      familyGroupId,
    ),
    queryFn: () =>
      ReportsService.getExpensesIncomeComparison({
        year,
        userId,
        familyGroupId,
      }),
    enabled,
  });
}
