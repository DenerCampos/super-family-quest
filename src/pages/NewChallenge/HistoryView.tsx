import {
  Box,
  HStack,
  Image,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { useQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { FamilyGroupBadge } from '../../components/family/FamilyGroupBadge';
import { api } from '../../services';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { choreQueryKeys } from '../../hooks/choreQueryKeys';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { formatYearMonthCompact } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { toDisplayableImageUrl } from '../../utils/formatString';
import type { ChoreOccurrenceResponseDto } from '../../types/chore';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';
import { MonthYearInput } from '../../components/MonthYearInput';

type TaggedHistory = ChoreOccurrenceResponseDto & {
  familyGroupId: string;
  familyGroupName: string;
};

export const HistoryView = () => {
  const { familyGroups, hasGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  const groupRefs = useMemo(
    () => familyGroups.map((g) => ({ id: g.id, name: g.name })),
    [familyGroups],
  );

  const historyQueries = useQueries({
    queries: groupRefs.map((g) => ({
      queryKey: choreQueryKeys.occurrences(
        g.id,
        `history-${year}-${month}`,
      ),
      queryFn: () =>
        api.choreListHistory(g.id, {
          page: 1,
          limit: 50,
          year,
          month,
        }),
      enabled: groupRefs.length > 0,
    })),
  });

  const updatedAt = historyQueries.map((q) => q.dataUpdatedAt).join(',');
  const rows = useMemo(() => {
    const tagged: TaggedHistory[] = [];
    historyQueries.forEach((result, index) => {
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
  }, [groupRefs, updatedAt, year, month]);

  const isLoadingHistory = historyQueries.some((q) => q.isLoading);

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.history.title')}
        isLoading
      />
    );
  }

  if (!hasGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.history.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  return (
    <ChallengePageScaffold title={t('newChallenge.tiles.history.title')}>
      <VStack align="stretch" spacing={4} pb={8}>
        <MonthYearInput
          year={year}
          month={month}
          onChange={({ year: y, month: m }) => {
            setYear(y);
            setMonth(m);
          }}
        />

        {isLoadingHistory ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('common.loading')}
          </Text>
        ) : rows.length === 0 ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('chores.emptyHistory')}
          </Text>
        ) : (
          rows.map((item) => (
            <HistoryOccurrenceCard
              key={`${item.familyGroupId}-${item.id}`}
              item={item}
            />
          ))
        )}
      </VStack>
    </ChallengePageScaffold>
  );
};

function HistoryOccurrenceCard({ item }: { item: TaggedHistory }) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const reward = item.snapshotRewardMoney ?? item.definition.rewardValue;
  return (
    <Box
      p={3}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={getColor('border.familyGroup.card')}
      bg={getColor('background.familyGroup.card')}
    >
      <Box mb={2}>
        <FamilyGroupBadge name={item.familyGroupName} />
      </Box>
      <Text fontWeight="bold" fontFamily={getFont('body')} mb={1}>
        {item.definition.title}
      </Text>
      <HStack mb={2}>
        <Badge
          bg={getColor('background.familyGroup.memberCard')}
          color={getColor('text.familyGroup.title')}
          borderWidth="1px"
          borderColor={getColor('border.primary')}
        >
          {t(`chores.status.${item.status}`)}
        </Badge>
        <Text fontSize="sm" color={getColor('text.coin')}>
          {formatCurrency(reward)}
        </Text>
      </HStack>
      {item.earnedPeriodYm ? (
        <Text fontSize="xs" color={getColor('text.familyGroup.secondary')} mb={2}>
          {t('chores.earnedPeriodDisplay', {
            value: formatYearMonthCompact(item.earnedPeriodYm),
          })}
        </Text>
      ) : null}
      <HStack spacing={2} flexWrap="wrap">
        {item.photoBeforeUrl ? (
          <Image
            src={toDisplayableImageUrl(item.photoBeforeUrl) || item.photoBeforeUrl}
            alt=""
            maxH="72px"
            borderRadius="md"
          />
        ) : null}
        {item.photoAfterUrl ? (
          <Image
            src={toDisplayableImageUrl(item.photoAfterUrl) || item.photoAfterUrl}
            alt=""
            maxH="72px"
            borderRadius="md"
          />
        ) : null}
      </HStack>
    </Box>
  );
}
