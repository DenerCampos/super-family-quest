import { useToast } from '@chakra-ui/react';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services';
import type { ChoreOccurrenceResponseDto } from '../types/chore';
import { isAdminOfAnyFamilyGroup } from '../utils/adminFamilyMembers';
import { isAdmin } from '../utils/familyGroupPermissions';
import { choreQueryKeys } from './choreQueryKeys';
import { useFamilyGroup } from './useFamilyGroup';
import { useThemedTranslation } from './useThemedTranslation';

export type TaggedPendingApproval = ChoreOccurrenceResponseDto & {
  familyGroupId: string;
  familyGroupName: string;
};

export function usePendingApprovals() {
  const { familyGroups, hasGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { profile, loadProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useThemedTranslation();

  const [rejectTarget, setRejectTarget] =
    useState<TaggedPendingApproval | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const userId = profile?.user.id ?? '';
  const userIsAdminAnywhere = isAdminOfAnyFamilyGroup(familyGroups, userId);

  const adminGroups = useMemo(
    () =>
      familyGroups
        .filter((g) => isAdmin(g, userId))
        .map((g) => ({ id: g.id, name: g.name })),
    [familyGroups, userId],
  );

  useEffect(() => {
    if (!isLoadingGroup && hasGroup && !userIsAdminAnywhere) {
      toast({ title: t('chores.adminOnly'), status: 'warning' });
      navigate('/new-resources/quests', { replace: true });
    }
  }, [
    isLoadingGroup,
    hasGroup,
    userIsAdminAnywhere,
    navigate,
    toast,
    t,
  ]);

  const pendingQueries = useQueries({
    queries: adminGroups.map((g) => ({
      queryKey: choreQueryKeys.occurrences(g.id, 'pending-approval'),
      queryFn: () =>
        api.choreListPendingApproval(g.id, { page: 1, limit: 50 }),
      enabled: adminGroups.length > 0 && userIsAdminAnywhere,
      refetchInterval: 45_000,
    })),
  });

  const updatedAt = pendingQueries.map((q) => q.dataUpdatedAt).join(',');
  const rows = useMemo(() => {
    const tagged: TaggedPendingApproval[] = [];
    pendingQueries.forEach((result, index) => {
      const group = adminGroups[index];
      if (!group) return;
      for (const item of result.data?.data ?? []) {
        tagged.push({
          ...item,
          familyGroupId: group.id,
          familyGroupName: group.name,
        });
      }
    });
    return tagged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminGroups, updatedAt]);

  const isLoadingPending = pendingQueries.some((q) => q.isLoading);

  const approveMutation = useMutation({
    mutationFn: ({
      familyGroupId,
      occurrenceId,
    }: {
      familyGroupId: string;
      occurrenceId: string;
    }) => api.choreApproveOccurrence(familyGroupId, occurrenceId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      await loadProfile();
      toast({ title: t('chores.approved'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chores.approveError'),
        status: 'error',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      familyGroupId,
      id,
      reason,
    }: {
      familyGroupId: string;
      id: string;
      reason: string;
    }) => api.choreRejectOccurrence(familyGroupId, id, { reason }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      setRejectTarget(null);
      setRejectReason('');
      await loadProfile();
      toast({ title: t('chores.rejected'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chores.rejectError'),
        status: 'error',
      });
    },
  });

  const returnForAdjustmentMutation = useMutation({
    mutationFn: ({
      familyGroupId,
      occurrenceId,
    }: {
      familyGroupId: string;
      occurrenceId: string;
    }) => api.choreReturnOccurrenceForAdjustment(familyGroupId, occurrenceId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      await loadProfile();
      toast({ title: t('chores.returnedForAdjustment'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chores.returnForAdjustmentError'),
        status: 'error',
      });
    },
  });

  const openReject = (item: TaggedPendingApproval) => {
    setRejectTarget(item);
    setRejectReason('');
  };

  const closeReject = () => {
    setRejectTarget(null);
    setRejectReason('');
  };

  const confirmReject = () => {
    if (!rejectTarget || !rejectReason.trim()) {
      toast({ title: t('chores.rejectReasonRequired'), status: 'warning' });
      return;
    }
    if (rejectReason.length > 2000) {
      toast({ title: t('chores.rejectReasonTooLong'), status: 'warning' });
      return;
    }
    rejectMutation.mutate({
      familyGroupId: rejectTarget.familyGroupId,
      id: rejectTarget.id,
      reason: rejectReason.trim(),
    });
  };

  return {
    hasGroup,
    isLoadingGroup,
    userIsAdminAnywhere,
    rows,
    isLoadingPending,
    approveMutation,
    rejectMutation,
    returnForAdjustmentMutation,
    rejectTarget,
    rejectReason,
    setRejectReason,
    openReject,
    closeReject,
    confirmReject,
  };
}
