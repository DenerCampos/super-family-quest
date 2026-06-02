import { useQuery } from '@tanstack/react-query';
import { CoinService } from '../services/coin';

export const coinStatementQueryKey = {
  root: ['coinStatement'] as const,
  list: (
    startDate: string,
    endDate: string,
    userId: string | undefined,
    page: number,
  ) =>
    [...coinStatementQueryKey.root, startDate, endDate, userId ?? 'default', page] as const,
};

export function useCoinStatement(params: {
  startDate: string;
  endDate: string;
  userId?: string;
  page: number;
  enabled?: boolean;
}) {
  const { startDate, endDate, userId, page, enabled = true } = params;

  return useQuery({
    queryKey: coinStatementQueryKey.list(startDate, endDate, userId, page),
    queryFn: () =>
      CoinService.getStatement({
        startDate,
        endDate,
        userId,
        page,
        limit: 20,
      }),
    enabled,
  });
}
