import {
  Box,
  Badge,
  Button,
  HStack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FamilyGroupBadge } from '../../components/family/FamilyGroupBadge';
import { api } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { choreQueryKeys } from '../../hooks/choreQueryKeys';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import {
  isAdminOfAnyFamilyGroup,
  pickAdminFamilyGroupId,
} from '../../utils/adminFamilyMembers';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { formatCurrency } from '../../utils/formatCurrency';
import type { ChoreDefinitionResponseDto } from '../../types/chore';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';

type TaggedDefinition = ChoreDefinitionResponseDto & {
  familyGroupId: string;
  familyGroupName: string;
};

export const DefinitionsListView = () => {
  const { familyGroups, familyGroup, isLoadingGroup, hasGroup } = useFamilyGroup(
    {
      fetchSummary: false,
      fetchInvitations: false,
    },
  );
  const { profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const userId = profile?.user.id ?? '';
  const canCreate = isAdminOfAnyFamilyGroup(familyGroups, userId);
  const createTargetGroupId = pickAdminFamilyGroupId(
    familyGroups,
    userId,
    familyGroup?.id,
  );

  const groupRefs = useMemo(
    () => familyGroups.map((g) => ({ id: g.id, name: g.name })),
    [familyGroups],
  );

  const listQueries = useQueries({
    queries: groupRefs.map((g) => ({
      queryKey: choreQueryKeys.definitions(g.id),
      queryFn: () => api.choreListDefinitions(g.id, { page: 1, limit: 50 }),
      enabled: groupRefs.length > 0,
    })),
  });

  const updatedAt = listQueries.map((q) => q.dataUpdatedAt).join(',');
  const rows = useMemo(() => {
    const tagged: TaggedDefinition[] = [];
    listQueries.forEach((result, index) => {
      const group = groupRefs[index];
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
  }, [groupRefs, updatedAt]);

  const isLoadingList = listQueries.some((q) => q.isLoading);

  const deleteMutation = useMutation({
    mutationFn: ({
      familyGroupId,
      definitionId,
    }: {
      familyGroupId: string;
      definitionId: string;
    }) => api.choreDeleteDefinition(familyGroupId, definitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      toast({ title: t('common.deleted'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('common.deleteError'),
        status: 'error',
      });
    },
  });

  const handleDelete = (d: TaggedDefinition) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(t('chores.deleteDefinitionConfirm'))
    ) {
      return;
    }
    deleteMutation.mutate({
      familyGroupId: d.familyGroupId,
      definitionId: d.id,
    });
  };

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.definitions.title')}
        isLoading
      />
    );
  }

  if (!hasGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.definitions.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  return (
    <ChallengePageScaffold title={t('newChallenge.tiles.definitions.title')}>
      <VStack align="stretch" spacing={4} pb={8}>
        {canCreate && createTargetGroupId ? (
          <Button
            bg={getColor('button.background.primary')}
            color={getColor('button.text.primary')}
            onClick={() =>
              navigate('/new-resources/quests/definitions/new', {
                state: { familyGroupId: createTargetGroupId },
              })
            }
          >
            {t('chores.newDefinition')}
          </Button>
        ) : null}
        {isLoadingList ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('common.loading')}
          </Text>
        ) : rows.length === 0 ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('chores.emptyDefinitions')}
          </Text>
        ) : (
          rows.map((d) => {
            const group = familyGroups.find((g) => g.id === d.familyGroupId);
            const canManage = group ? isAdmin(group, userId) : false;
            return (
              <Box
                key={`${d.familyGroupId}-${d.id}`}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={getColor('border.familyGroup.card')}
                bg={getColor('background.familyGroup.card')}
              >
                <HStack justify="space-between" align="flex-start" mb={2}>
                  <VStack align="flex-start" spacing={1}>
                    <FamilyGroupBadge name={d.familyGroupName} />
                    <Text
                      fontWeight="bold"
                      fontFamily={getFont('body')}
                      color={getColor('text.familyGroup.title')}
                    >
                      {d.title}
                    </Text>
                  </VStack>
                  {!d.isActive ? (
                    <Badge>{t('chores.inactive')}</Badge>
                  ) : null}
                </HStack>
                <Text
                  fontSize="sm"
                  color={getColor('text.dashboard.tileSubtitle')}
                  mb={1}
                >
                  {formatCurrency(d.rewardValue)}
                  {d.coinReward > 0
                    ? ` · ${t('chores.coinsReward', { count: d.coinReward })}`
                    : ''}
                </Text>
                <Text
                  fontSize="xs"
                  color={getColor('text.familyGroup.secondary')}
                >
                  {t('chores.fieldRecurrence')}:{' '}
                  {t(`chores.recurrence.${d.recurrence}`)}
                  {d.requirePhoto ? ` · ${t('chores.badgeRequiresPhoto')}` : ''}
                </Text>
                {canManage ? (
                  <HStack mt={3} spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor={getColor('border.primary')}
                      color={getColor('text.familyGroup.title')}
                      onClick={() =>
                        navigate(
                          `/new-resources/quests/definitions/${d.id}`,
                          { state: { familyGroupId: d.familyGroupId } },
                        )
                      }
                    >
                      {t('common.update')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor={getColor('status.error')}
                      color={getColor('status.error')}
                      onClick={() => handleDelete(d)}
                      isLoading={deleteMutation.isPending}
                    >
                      {t('common.delete')}
                    </Button>
                  </HStack>
                ) : null}
              </Box>
            );
          })
        )}
      </VStack>
    </ChallengePageScaffold>
  );
};
