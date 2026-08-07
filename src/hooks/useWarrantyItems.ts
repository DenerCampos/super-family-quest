import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports';
import { warrantyItemsQueryKey } from './warrantyItemsQueryKeys';

export function useWarrantyItems(params: {
  year: number;
  userId?: string;
  familyGroupId?: string;
  search: string;
  includeExpired: boolean;
  page: number;
  enabled?: boolean;
}) {
  const {
    year,
    userId,
    familyGroupId,
    search,
    includeExpired,
    page,
    enabled = true,
  } = params;

  return useQuery({
    queryKey: warrantyItemsQueryKey.list(
      year,
      userId,
      familyGroupId,
      search,
      includeExpired,
      page,
    ),
    queryFn: () =>
      ReportsService.getWarrantyItems({
        year: year.toString(),
        userId,
        familyGroupId,
        search: search || undefined,
        includeExpired,
        page,
        limit: 25,
      }),
    enabled,
  });
}
