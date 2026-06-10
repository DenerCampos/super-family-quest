import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';

export const topProductsQueryKey = {
  root: ['topProducts'] as const,
  list: (startDate: string, endDate: string, userId: string | undefined) =>
    [...topProductsQueryKey.root, startDate, endDate, userId ?? 'default'] as const,
};

export function useTopProducts(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, enabled = true } = params;

  return useQuery({
    queryKey: topProductsQueryKey.list(startDate, endDate, userId),
    queryFn: () =>
      ReportsService.getMostPurchasedItems({ startDate, endDate, userId }),
    enabled,
  });
}
