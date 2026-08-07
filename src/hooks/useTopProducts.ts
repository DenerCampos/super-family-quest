import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const topProductsQueryKey = {
  root: ['topProducts'] as const,
  list: (
    startDate: string,
    endDate: string,
    userId: string | undefined,
    familyGroupId: string | undefined,
  ) =>
    [
      ...topProductsQueryKey.root,
      startDate,
      endDate,
      userId ?? 'default',
      familyGroupId ?? 'none',
    ] as const,
};

export function useTopProducts(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, familyGroupId, enabled = true } = params;

  return useQuery({
    queryKey: topProductsQueryKey.list(
      startDate,
      endDate,
      userId,
      familyGroupId,
    ),
    queryFn: () =>
      ReportsService.getMostPurchasedItems({
        startDate,
        endDate,
        userId,
        familyGroupId,
      }),
    enabled,
  });
}
