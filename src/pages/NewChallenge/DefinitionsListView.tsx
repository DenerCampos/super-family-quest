import {
  Box,
  Badge,
  Button,
  HStack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { choreQueryKeys } from '../../hooks/choreQueryKeys';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { formatCurrency } from '../../utils/formatCurrency';
import type { ChoreDefinitionResponseDto } from '../../types/chore';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';

export const DefinitionsListView = () => {
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const groupId = familyGroup?.id;
  const userId = profile?.user.id ?? '';
  const userIsAdmin = familyGroup ? isAdmin(familyGroup, userId) : false;

  const listQuery = useQuery({
    queryKey: choreQueryKeys.definitions(groupId ?? ''),
    queryFn: () => api.choreListDefinitions(groupId!, { page: 1, limit: 50 }),
    enabled: !!groupId,
  });

  const deleteMutation = useMutation({
    mutationFn: (definitionId: string) =>
      api.choreDeleteDefinition(groupId!, definitionId),
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

  const handleDelete = (d: ChoreDefinitionResponseDto) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(t('chores.deleteDefinitionConfirm'))
    ) {
      return;
    }
    deleteMutation.mutate(d.id);
  };

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.definitions.title')}
        isLoading
      />
    );
  }

  if (!familyGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.definitions.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  const rows = listQuery.data?.data ?? [];

  return (
    <ChallengePageScaffold title={t('newChallenge.tiles.definitions.title')}>
      <VStack align="stretch" spacing={4} pb={8}>
        {userIsAdmin && (
          <Button
            bg={getColor('button.background.primary')}
            color={getColor('button.text.primary')}
            onClick={() => navigate('/new-resources/quests/definitions/new')}
          >
            {t('chores.newDefinition')}
          </Button>
        )}
        {listQuery.isLoading ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>{t('common.loading')}</Text>
        ) : rows.length === 0 ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('chores.emptyDefinitions')}
          </Text>
        ) : (
          rows.map((d) => (
            <Box
              key={d.id}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={getColor('border.familyGroup.card')}
              bg={getColor('background.familyGroup.card')}
            >
              <HStack justify="space-between" align="flex-start" mb={2}>
                <Text
                  fontWeight="bold"
                  fontFamily={getFont('body')}
                  color={getColor('text.familyGroup.title')}
                >
                  {d.title}
                </Text>
                {!d.isActive ? (
                  <Badge>{t('chores.inactive')}</Badge>
                ) : null}
              </HStack>
              <Text fontSize="sm" color={getColor('text.dashboard.tileSubtitle')} mb={1}>
                {formatCurrency(d.rewardValue)}
                {d.coinReward > 0
                  ? ` · ${t('chores.coinsReward', { count: d.coinReward })}`
                  : ''}
              </Text>
              <Text fontSize="xs" color={getColor('text.familyGroup.secondary')}>
                {t('chores.fieldRecurrence')}:{' '}
                {t(`chores.recurrence.${d.recurrence}`)}
                {d.requirePhoto ? ` · ${t('chores.badgeRequiresPhoto')}` : ''}
              </Text>
              {userIsAdmin && (
                <HStack mt={3} spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor={getColor('border.primary')}
                    color={getColor('text.familyGroup.title')}
                    onClick={() =>
                      navigate(`/new-resources/quests/definitions/${d.id}`)
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
              )}
            </Box>
          ))
        )}
      </VStack>
    </ChallengePageScaffold>
  );
};
