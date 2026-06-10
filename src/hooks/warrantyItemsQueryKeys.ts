export const warrantyItemsQueryKey = {
  root: ['warrantyItems'] as const,
  list: (
    year: number,
    userId: string | undefined,
    search: string,
    includeExpired: boolean,
    page: number,
  ) =>
    [
      ...warrantyItemsQueryKey.root,
      year,
      userId ?? 'default',
      search,
      includeExpired ? 'expired' : 'active',
      page,
    ] as const,
};
