import { Box, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useChoreQuestLists } from '../../hooks/useChoreQuestLists';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { resolveChakraColor } from '../../utils/resolveColor';
import { isChoreOccurrenceExpiring } from '../../utils/chore-expiry';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';
import { OccurrenceCarousel } from './QuestOccurrenceCarousel';

export const QuestsListView = () => {
  const { theme, getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const {
    hasGroup,
    isLoadingGroup,
    openRows,
    mineRows,
    isLoadingOpen,
    isLoadingMine,
    startMutation,
    handleOpen,
    handleStart,
  } = useChoreQuestLists();

  const inProgressRows = useMemo(() => {
    const rows = mineRows.filter((r) => r.status === 'IN_PROGRESS');
    return [...rows].sort((a, b) => {
      const ea = isChoreOccurrenceExpiring(a);
      const eb = isChoreOccurrenceExpiring(b);
      if (ea === eb) return 0;
      return ea ? -1 : 1;
    });
  }, [mineRows]);

  const waitingRows = useMemo(
    () => mineRows.filter((r) => r.status === 'WAITING_APPROVAL'),
    [mineRows],
  );

  const sectionShadow = resolveChakraColor(
    theme.colors.background.familyGroup.elevatedShadow,
  );

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.quests.title')}
        backTo="/new-resources/quests"
        isLoading
      />
    );
  }

  if (!hasGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.quests.title')}
        backTo="/new-resources/quests"
      >
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  return (
    <ChallengePageScaffold
      title={t('newChallenge.tiles.quests.title')}
      backTo="/new-resources/quests"
      contentLayout="plain"
    >
      <VStack spacing={4} align="stretch" pb={8}>
        <Box
          w="100%"
          bg={getColor('background.familyGroup.card')}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={getColor('border.familyGroup.card')}
          p={{ base: 4, md: 5 }}
          boxShadow={sectionShadow}
        >
          <Text
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.dashboard.title')}
            mb={2}
          >
            {t('chores.sectionOpen')}
          </Text>
          {isLoadingOpen ? (
            <Text color={getColor('text.familyGroup.primary')}>
              {t('common.loading')}
            </Text>
          ) : openRows.length === 0 ? (
            <Text color={getColor('text.familyGroup.primary')}>
              {t('chores.emptyOpen')}
            </Text>
          ) : (
            <OccurrenceCarousel
              ariaLabel={t('chores.sectionOpen')}
              rows={openRows}
              showStart
              isStarting={startMutation.isPending}
              onStart={handleStart}
              onOpen={handleOpen}
            />
          )}
        </Box>

        <Box
          w="100%"
          bg={getColor('background.familyGroup.card')}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={getColor('border.familyGroup.card')}
          p={{ base: 4, md: 5 }}
          boxShadow={sectionShadow}
        >
          <Text
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.dashboard.title')}
            mb={2}
          >
            {t('chores.sectionInProgress')}
          </Text>
          {isLoadingMine ? (
            <Text color={getColor('text.familyGroup.primary')}>
              {t('common.loading')}
            </Text>
          ) : inProgressRows.length === 0 ? (
            <Text color={getColor('text.familyGroup.primary')}>
              {t('chores.emptyInProgress')}
            </Text>
          ) : (
            <OccurrenceCarousel
              ariaLabel={t('chores.sectionInProgress')}
              rows={inProgressRows}
              showStart={false}
              isStarting={false}
              onStart={() => {}}
              onOpen={handleOpen}
              highlightExpiring
            />
          )}
        </Box>

        <Box
          w="100%"
          bg={getColor('background.familyGroup.card')}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={getColor('border.familyGroup.card')}
          p={{ base: 4, md: 5 }}
          boxShadow={sectionShadow}
        >
          <Text
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.dashboard.title')}
            mb={2}
          >
            {t('chores.sectionWaitingApproval')}
          </Text>
          {isLoadingMine ? (
            <Text color={getColor('text.familyGroup.primary')}>
              {t('common.loading')}
            </Text>
          ) : waitingRows.length === 0 ? (
            <Text color={getColor('text.familyGroup.primary')}>
              {t('chores.emptyWaiting')}
            </Text>
          ) : (
            <OccurrenceCarousel
              ariaLabel={t('chores.sectionWaitingApproval')}
              rows={waitingRows}
              showStart={false}
              isStarting={false}
              onStart={() => {}}
              onOpen={handleOpen}
            />
          )}
        </Box>
      </VStack>
    </ChallengePageScaffold>
  );
};
