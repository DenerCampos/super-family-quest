export type WarrantyItem = {
  id: string;
  name: string;
  quantity: number;
  warrantyDuration: number;
  warrantyUnit: 'days' | 'months' | 'years';
  warrantyExpiresAt: string;
  purchaseDate: string;
  daysRemaining: number;
  isExpired: boolean;
  expenseId: string;
  expenseName: string;
  storeName: string | null;
  userId: string;
  userName: string;
};

export type PaginatedWarrantyItems = {
  data: WarrantyItem[];
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
