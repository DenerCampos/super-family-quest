import { useQuery } from '@tanstack/react-query';
import { CoinService } from '../services/coin';

export const coinStatementQueryKey = {
  root: ['coinStatement'] as const,
  list: (
    startDate: string,
    endDate: string,
    userId: string | undefined,
    familyGroupId: string | undefined,
    page: number,
  ) =>
    [
      ...coinStatementQueryKey.root,
      startDate,
      endDate,
      userId ?? 'default',
      familyGroupId ?? 'none',
      page,
    ] as const,
};

export function useCoinStatement(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
  page: number;
  enabled?: boolean;
}) {
  const {
    startDate,
    endDate,
    userId,
    familyGroupId,
    page,
    enabled = true,
  } = params;

  return useQuery({
    queryKey: coinStatementQueryKey.list(
      startDate,
      endDate,
      userId,
      familyGroupId,
      page,
    ),
    queryFn: () =>
      CoinService.getStatement({
        startDate,
        endDate,
        userId,
        familyGroupId,
        page,
        limit: 20,
      }),
    enabled,
  });
}
