export const familyGroupQueryKeys = {
  all: ['familyGroup'] as const,
  list: () => [...familyGroupQueryKeys.all, 'list'] as const,
  invitations: () => [...familyGroupQueryKeys.all, 'invitations'] as const,
  summary: (groupId: string, month: number, year: number) =>
    [...familyGroupQueryKeys.all, 'summary', groupId, month, year] as const,
  memberData: (
    groupId: string,
    memberId: string,
    month: number,
    year: number,
  ) =>
    [
      ...familyGroupQueryKeys.all,
      'memberData',
      groupId,
      memberId,
      month,
      year,
    ] as const,
};
