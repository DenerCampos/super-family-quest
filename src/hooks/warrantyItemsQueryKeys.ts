export const warrantyItemsQueryKey = {
  root: ['warrantyItems'] as const,
  list: (
    year: number,
    userId: string | undefined,
    familyGroupId: string | undefined,
    search: string,
    includeExpired: boolean,
    page: number,
  ) =>
    [
      ...warrantyItemsQueryKey.root,
      year,
      userId ?? 'default',
      familyGroupId ?? 'none',
      search,
      includeExpired ? 'expired' : 'active',
      page,
    ] as const,
};
