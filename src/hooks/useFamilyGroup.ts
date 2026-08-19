import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services';
import type {
  FamilyGroupSummaryDto,
  MemberDataDto,
  MemberSummary,
} from '../types/familyGroup';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import {
  pickPrimaryFamilyGroup,
  sortFamilyGroupDtos,
  toFamilyGroupPriorityInput,
} from '../utils/familyGroupPriority';
import { isAdmin, isOwner } from '../utils/familyGroupPermissions';
import { familyGroupQueryKeys } from './familyGroupQueryKeys';

export type FamilyStoryGroup = {
  id: string;
  name: string;
  isOwner: boolean;
  isAdmin: boolean;
  /** Foto do grupo quando existir, senão o brasão escolhido. */
  image?: string | null;
};

export type UseFamilyGroupOptions = {
  /** Busca resumo mensal (Home, grupo familiar). Padrão: true */
  fetchSummary?: boolean;
  /** Busca convites pendentes. Padrão: true */
  fetchInvitations?: boolean;
};

function readStoredFamilyGroupId(): string | null {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_FAMILY_GROUP_ID);
  } catch {
    return null;
  }
}

function persistFamilyGroupId(id: string | null) {
  try {
    if (id) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_FAMILY_GROUP_ID, id);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_FAMILY_GROUP_ID);
    }
  } catch {
    // ignore quota / private mode
  }
}

export const useFamilyGroup = (options: UseFamilyGroupOptions = {}) => {
  const fetchSummary = options.fetchSummary !== false;
  const fetchInvitations = options.fetchInvitations !== false;
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const currentUserId = profile?.user.id ?? '';

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedFamilyGroupId, setSelectedFamilyGroupIdState] = useState<
    string | null
  >(readStoredFamilyGroupId);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const listQuery = useQuery({
    queryKey: familyGroupQueryKeys.list(),
    queryFn: () => api.familyGroupList(),
    staleTime: 60_000,
  });

  const familyGroups = useMemo(() => {
    const list = listQuery.data ?? [];
    if (!currentUserId) return list;
    return sortFamilyGroupDtos(list, currentUserId);
  }, [listQuery.data, currentUserId]);

  const activeFamilyGroupId = useMemo(() => {
    if (!currentUserId || familyGroups.length === 0) return null;
    const primary = pickPrimaryFamilyGroup(
      familyGroups.map((g) => toFamilyGroupPriorityInput(g, currentUserId)),
      currentUserId,
    );
    return primary?.id ?? familyGroups[0]?.id ?? null;
  }, [familyGroups, currentUserId]);

  const resolvedSelectedFamilyGroupId = useMemo(() => {
    if (familyGroups.length === 0) return null;
    if (
      selectedFamilyGroupId &&
      familyGroups.some((g) => g.id === selectedFamilyGroupId)
    ) {
      return selectedFamilyGroupId;
    }
    return activeFamilyGroupId;
  }, [familyGroups, selectedFamilyGroupId, activeFamilyGroupId]);

  useEffect(() => {
    if (!listQuery.isSuccess) return;
    if (familyGroups.length === 0) {
      if (selectedFamilyGroupId !== null) {
        setSelectedFamilyGroupIdState(null);
        persistFamilyGroupId(null);
      }
      return;
    }
    if (
      selectedFamilyGroupId &&
      !familyGroups.some((g) => g.id === selectedFamilyGroupId)
    ) {
      setSelectedFamilyGroupIdState(activeFamilyGroupId);
      persistFamilyGroupId(activeFamilyGroupId);
    }
  }, [
    listQuery.isSuccess,
    familyGroups,
    selectedFamilyGroupId,
    activeFamilyGroupId,
  ]);

  const setSelectedFamilyGroupId = useCallback((id: string | null) => {
    setSelectedFamilyGroupIdState(id);
    persistFamilyGroupId(id);
    setSelectedMemberId(null);
  }, []);

  const familyGroup =
    familyGroups.find((g) => g.id === resolvedSelectedFamilyGroupId) ?? null;
  const groupId = familyGroup?.id;
  const hasGroup = familyGroups.length > 0;

  const familyStoryGroups: FamilyStoryGroup[] = useMemo(() => {
    if (!currentUserId) return [];
    return familyGroups.map((group) => ({
      id: group.id,
      name: group.name,
      isOwner: isOwner(group, currentUserId),
      isAdmin: isAdmin(group, currentUserId),
      image: group.groupImage || group.coatOfArms,
    }));
  }, [familyGroups, currentUserId]);

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
    familyGroups,
    familyGroup,
    familyStoryGroups,
    selectedFamilyGroupId: resolvedSelectedFamilyGroupId,
    setSelectedFamilyGroupId,
    activeFamilyGroupId,
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
