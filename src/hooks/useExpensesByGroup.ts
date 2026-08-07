import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesByGroupQueryKey = {
  root: ['expensesByGroup'] as const,
  list: (
    startDate: string,
    endDate: string,
    userId: string | undefined,
    familyGroupId: string | undefined,
  ) =>
    [
      ...expensesByGroupQueryKey.root,
      startDate,
      endDate,
      userId ?? 'default',
      familyGroupId ?? 'none',
    ] as const,
};

export function useExpensesByGroup(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, familyGroupId, enabled = true } = params;

  return useQuery({
    queryKey: expensesByGroupQueryKey.list(
      startDate,
      endDate,
      userId,
      familyGroupId,
    ),
    queryFn: () =>
      ReportsService.getExpenseByGroup({
        startDate,
        endDate,
        userId,
        familyGroupId,
      }),
    enabled,
  });
}
