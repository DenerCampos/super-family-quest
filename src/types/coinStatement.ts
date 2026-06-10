export type CoinTransactionType =
  | 'earn'
  | 'spend'
  | 'bonus'
  | 'penalty'
  | 'refund';

export type CoinTransactionItem = {
  id: string;
  amount: number;
  transactionType: CoinTransactionType;
  description: string | null;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  userId: string;
  userName: string;
};

export type CoinStatementTotals = {
  totalEarned: number;
  totalSpent: number;
};

export type PaginatedCoinStatement = {
  totals: CoinStatementTotals;
  data: CoinTransactionItem[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string | null;
    next: string | null;
    last: string;
  };
};
