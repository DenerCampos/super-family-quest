export const choreQueryKeys = {
  root: ['chores'] as const,
  definitions: (familyGroupId: string) =>
    [...choreQueryKeys.root, 'definitions', familyGroupId] as const,
  occurrences: (familyGroupId: string, suffix: string) =>
    [...choreQueryKeys.root, 'occurrences', familyGroupId, suffix] as const,
  occurrenceDetail: (familyGroupId: string, occurrenceId: string) =>
    [...choreQueryKeys.root, 'occurrence', familyGroupId, occurrenceId] as const,
  payrollPending: (
    familyGroupId: string,
    year?: number,
    month?: number,
  ) =>
    [...choreQueryKeys.root, 'payrollPending', familyGroupId, year, month] as const,
  payrollSuggestion: (familyGroupId: string) =>
    [...choreQueryKeys.root, 'payrollSuggestion', familyGroupId] as const,
};
