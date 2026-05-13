import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services';
import { useFamilyGroup } from './useFamilyGroup';
import { choreQueryKeys } from './choreQueryKeys';
import { useThemedTranslation } from './useThemedTranslation';
import type { ChoreOccurrenceResponseDto } from '../types/chore';

export const useChoreQuestLists = () => {
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const groupId = familyGroup?.id;

  const openQuery = useQuery({
    queryKey: choreQueryKeys.occurrences(groupId ?? '', 'open'),
    queryFn: () =>
      api.choreListOccurrences(groupId!, { page: 1, limit: 50 }),
    enabled: !!groupId,
  });

  const mineQuery = useQuery({
    queryKey: choreQueryKeys.occurrences(groupId ?? '', 'mine'),
    queryFn: () => api.choreListMine(groupId!, { page: 1, limit: 50 }),
    enabled: !!groupId,
  });

  const startMutation = useMutation({
    mutationFn: (occurrenceId: string) =>
      api.choreStartOccurrence(groupId!, occurrenceId),
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

  const handleOpen = (item: ChoreOccurrenceResponseDto) => {
    navigate(`/new-challenge/quests/${item.id}`, {
      state: { occurrence: item },
    });
  };

  return {
    familyGroup,
    isLoadingGroup,
    groupId,
    openQuery,
    mineQuery,
    startMutation,
    handleOpen,
  };
};
