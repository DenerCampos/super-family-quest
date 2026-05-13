import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { api } from '../services';
import type {
  FamilyGroupSummaryDto,
  MemberDataDto,
  MemberSummary,
} from '../types/familyGroup';
import { familyGroupQueryKeys } from './familyGroupQueryKeys';

export type UseFamilyGroupOptions = {
  /** Busca resumo mensal (Home, grupo familiar). Padrão: true */
  fetchSummary?: boolean;
  /** Busca convites pendentes. Padrão: true */
  fetchInvitations?: boolean;
};

export const useFamilyGroup = (options: UseFamilyGroupOptions = {}) => {
  const fetchSummary = options.fetchSummary !== false;
  const fetchInvitations = options.fetchInvitations !== false;
  const queryClient = useQueryClient();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const listQuery = useQuery({
    queryKey: familyGroupQueryKeys.list(),
    queryFn: () => api.familyGroupList(),
    staleTime: 60_000,
  });

  const familyGroup = listQuery.data?.[0] ?? null;
  const groupId = familyGroup?.id;
  const hasGroup = familyGroup !== null;

  const invitationsQuery = useQuery({
    queryKey: familyGroupQueryKeys.invitations(),
    queryFn: () => api.familyGroupListInvitations(),
    enabled: fetchInvitations,
    staleTime: 60_000,
  });

  const summaryQuery = useQuery({
    queryKey: familyGroupQueryKeys.summary(groupId ?? '', month, year),
    queryFn: () => api.familyGroupGetSummary(groupId!, month, year),
    enabled: fetchSummary && !!groupId,
    staleTime: 30_000,
  });

  const summary: FamilyGroupSummaryDto | null = summaryQuery.data ?? null;

  const familyMembers: MemberSummary[] = useMemo(
    () => summary?.members ?? [],
    [summary],
  );

  const memberDataQuery = useQuery({
    queryKey: familyGroupQueryKeys.memberData(
      groupId ?? '',
      selectedMemberId ?? '',
      month,
      year,
    ),
    queryFn: () =>
      api.familyGroupGetMemberData(groupId!, selectedMemberId!, month, year),
    enabled: Boolean(groupId && selectedMemberId),
  });

  const memberData: MemberDataDto | null = memberDataQuery.data ?? null;

  const selectedMember = useMemo(
    () => familyMembers.find((m) => m.userId === selectedMemberId) ?? null,
    [familyMembers, selectedMemberId],
  );

  const loadGroup = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: familyGroupQueryKeys.list(),
    });
  }, [queryClient]);

  const loadSummary = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: [...familyGroupQueryKeys.all, 'summary'],
    });
  }, [queryClient]);

  const loadPendingCount = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: familyGroupQueryKeys.invitations(),
    });
  }, [queryClient]);

  return {
    familyGroup,
    summary,
    memberData,
    selectedMemberId,
    setSelectedMemberId,
    pendingCount: invitationsQuery.data?.length ?? 0,
    isLoadingGroup: listQuery.isLoading,
    isLoadingSummary: summaryQuery.isLoading,
    isLoadingMemberData: memberDataQuery.isLoading,
    month,
    year,
    setMonth,
    setYear,
    hasGroup,
    familyMembers,
    selectedMember,
    loadGroup,
    loadSummary,
    loadPendingCount,
  };
};
