import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesByDateQueryKey = {
  root: ['expensesByDate'] as const,
  list: (
    startDate: string,
    endDate: string,
    userId: string | undefined,
    familyGroupId: string | undefined,
  ) =>
    [
      ...expensesByDateQueryKey.root,
      startDate,
      endDate,
      userId ?? 'default',
      familyGroupId ?? 'none',
    ] as const,
};

export function useExpensesByDate(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, familyGroupId, enabled = true } = params;

  return useQuery({
    queryKey: expensesByDateQueryKey.list(
      startDate,
      endDate,
      userId,
      familyGroupId,
    ),
    queryFn: () =>
      ReportsService.getExpenseByDate({
        startDate,
        endDate,
        userId,
        familyGroupId,
      }),
    enabled,
  });
}
