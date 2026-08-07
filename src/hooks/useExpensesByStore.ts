import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const expensesByStoreQueryKey = {
  root: ['expensesByStore'] as const,
  list: (
    startDate: string,
    endDate: string,
    userId: string | undefined,
    familyGroupId: string | undefined,
  ) =>
    [
      ...expensesByStoreQueryKey.root,
      startDate,
      endDate,
      userId ?? 'default',
      familyGroupId ?? 'none',
    ] as const,
};

export function useExpensesByStore(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, familyGroupId, enabled = true } = params;

  return useQuery({
    queryKey: expensesByStoreQueryKey.list(
      startDate,
      endDate,
      userId,
      familyGroupId,
    ),
    queryFn: () =>
      ReportsService.getExpenseByStore({
        startDate,
        endDate,
        userId,
        familyGroupId,
      }),
    enabled,
  });
}
