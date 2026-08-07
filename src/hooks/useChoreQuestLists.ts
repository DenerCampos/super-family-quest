import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services';
import type { ChoreOccurrenceResponseDto } from '../types/chore';
import { useFamilyGroup } from './useFamilyGroup';
import { choreQueryKeys } from './choreQueryKeys';
import { useThemedTranslation } from './useThemedTranslation';

export type TaggedChoreOccurrence = ChoreOccurrenceResponseDto & {
  familyGroupId: string;
  familyGroupName: string;
};

function flattenTagged(
  results: Array<{
    data?: { data: ChoreOccurrenceResponseDto[] };
    dataUpdatedAt: number;
  }>,
  groups: { id: string; name: string }[],
): TaggedChoreOccurrence[] {
  const rows: TaggedChoreOccurrence[] = [];
  results.forEach((result, index) => {
    const group = groups[index];
    if (!group) return;
    for (const item of result.data?.data ?? []) {
      rows.push({
        ...item,
        familyGroupId: group.id,
        familyGroupName: group.name,
      });
    }
  });
  return rows;
}

export const useChoreQuestLists = () => {
  const { familyGroups, familyGroup, isLoadingGroup, hasGroup } = useFamilyGroup(
    {
      fetchSummary: false,
      fetchInvitations: false,
    },
  );
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const groupRefs = useMemo(
    () => familyGroups.map((g) => ({ id: g.id, name: g.name })),
    [familyGroups],
  );

  const openQueries = useQueries({
    queries: groupRefs.map((g) => ({
      queryKey: choreQueryKeys.occurrences(g.id, 'open'),
      queryFn: () => api.choreListOccurrences(g.id, { page: 1, limit: 50 }),
      enabled: groupRefs.length > 0,
    })),
  });

  const mineQueries = useQueries({
    queries: groupRefs.map((g) => ({
      queryKey: choreQueryKeys.occurrences(g.id, 'mine'),
      queryFn: () => api.choreListMine(g.id, { page: 1, limit: 50 }),
      enabled: groupRefs.length > 0,
    })),
  });

  const openUpdatedAt = openQueries.map((q) => q.dataUpdatedAt).join(',');
  const mineUpdatedAt = mineQueries.map((q) => q.dataUpdatedAt).join(',');

  const openRows = useMemo(
    () => flattenTagged(openQueries, groupRefs),
    // openUpdatedAt tracks query data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupRefs, openUpdatedAt],
  );

  const mineRows = useMemo(
    () => flattenTagged(mineQueries, groupRefs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupRefs, mineUpdatedAt],
  );

  const isLoadingOpen = openQueries.some((q) => q.isLoading);
  const isLoadingMine = mineQueries.some((q) => q.isLoading);

  const startMutation = useMutation({
    mutationFn: ({
      familyGroupId,
      occurrenceId,
    }: {
      familyGroupId: string;
      occurrenceId: string;
    }) => api.choreStartOccurrence(familyGroupId, occurrenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      toast({ title: t('common.success'), status: 'success' });
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast({
          title: t('chores.conflictAlreadyStarted'),
          status: 'warning',
        });
        queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
        return;
      }
      toast({
        title: t('common.error'),
        description: t('common.loadError'),
        status: 'error',
      });
    },
  });

  const handleOpen = (item: TaggedChoreOccurrence) => {
    navigate(`/new-resources/quests/chores/${item.id}`, {
      state: {
        occurrence: item,
        familyGroupId: item.familyGroupId,
      },
    });
  };

  const handleStart = (item: TaggedChoreOccurrence) => {
    startMutation.mutate({
      familyGroupId: item.familyGroupId,
      occurrenceId: item.id,
    });
  };

  return {
    familyGroup,
    familyGroups,
    isLoadingGroup,
    hasGroup,
    openRows,
    mineRows,
    isLoadingOpen,
    isLoadingMine,
    startMutation,
    handleOpen,
    handleStart,
  };
};
