import {
  Box,
  HStack,
  Image,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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

export const HistoryView = () => {
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const groupId = familyGroup?.id;
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  const historyQuery = useQuery({
    queryKey: choreQueryKeys.occurrences(groupId ?? '', `history-${year}-${month}`),
    queryFn: () =>
      api.choreListHistory(groupId!, {
        page: 1,
        limit: 50,
        year,
        month,
      }),
    enabled: !!groupId,
  });

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.history.title')}
        isLoading
      />
    );
  }

  if (!familyGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.history.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  const rows = historyQuery.data?.data ?? [];

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

        {historyQuery.isLoading ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>{t('common.loading')}</Text>
        ) : rows.length === 0 ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>{t('chores.emptyHistory')}</Text>
        ) : (
          rows.map((item) => (
            <HistoryOccurrenceCard key={item.id} item={item} />
          ))
        )}
      </VStack>
    </ChallengePageScaffold>
  );
};

function HistoryOccurrenceCard({ item }: { item: ChoreOccurrenceResponseDto }) {
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
