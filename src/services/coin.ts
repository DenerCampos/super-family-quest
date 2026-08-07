import api from './api';
import type { PaginatedCoinStatement } from '../types/coinStatement';

export interface BalanceCoin {
  balance: number;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined,
  );
  return entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

export const CoinService = {
  async getBalanceCoin(): Promise<{ balance: number }> {
    const response = await api.get<{ balance: number }>('/coin/balance');
    return response.data;
  },

  async getStatement(params: {
    startDate: string;
    endDate: string;
    userId?: string;
    familyGroupId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedCoinStatement> {
    const qs = buildQuery(params);
    const response = await api.get<PaginatedCoinStatement>(`/coin/statement?${qs}`);
    return response.data;
  },
};
