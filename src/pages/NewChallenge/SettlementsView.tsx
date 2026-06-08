import {
  Box,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { choreQueryKeys } from '../../hooks/choreQueryKeys';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { formatCurrency } from '../../utils/formatCurrency';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';
import { MonthYearInput } from '../../components/MonthYearInput';

function getPreviousMonthYear() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export const SettlementsView = () => {
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { profile, showValues } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const groupId = familyGroup?.id;
  const userId = profile?.user.id ?? '';
  const userIsAdmin = familyGroup ? isAdmin(familyGroup, userId) : false;

  const [filterYear, setFilterYear] = useState(() => getPreviousMonthYear().year);
  const [filterMonth, setFilterMonth] = useState(() => getPreviousMonthYear().month);

  useEffect(() => {
    if (!isLoadingGroup && familyGroup && !userIsAdmin) {
      toast({ title: t('chores.adminOnly'), status: 'warning' });
      navigate('/new-resources/quests', { replace: true });
    }
  }, [isLoadingGroup, familyGroup, userIsAdmin, navigate, toast, t]);

  const settlementQuery = useQuery({
    queryKey: choreQueryKeys.payrollSettlement(
      groupId ?? '',
      filterYear,
      filterMonth,
    ),
    queryFn: () =>
      api.choreGetPayrollSettlement(groupId!, {
        year: filterYear,
        month: filterMonth,
      }),
    enabled: !!groupId && userIsAdmin,
  });

  const formatYm = (ym: number) => {
    const y = Math.floor(ym / 100);
    const m = ym % 100;
    return `${String(m).padStart(2, '0')}/${y}`;
  };

  const displayAmount = (n: number) => {
    const safe = typeof n === 'number' && Number.isFinite(n) ? n : 0;
    return showValues ? formatCurrency(safe) : '••••••';
  };

  const formatSettledAt = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.settlements.title')}
        isLoading
      />
    );
  }

  if (!familyGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.settlements.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  if (!userIsAdmin) {
    return null;
  }

  const settlement = settlementQuery.data;

  return (
    <ChallengePageScaffold title={t('newChallenge.tiles.settlements.title')}>
      <VStack align="stretch" spacing={4} pb={8}>
        <MonthYearInput
          year={filterYear}
          month={filterMonth}
          onChange={({ year, month: m }) => {
            setFilterYear(year);
            setFilterMonth(m);
          }}
        />

        {settlementQuery.isLoading ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('common.loading')}
          </Text>
        ) : settlementQuery.isError ? (
          <Text color={getColor('status.error')}>
            {t('common.loadError')}
          </Text>
        ) : !settlement ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('settlements.empty')}
          </Text>
        ) : (
          <>
            <Box
              p={3}
              borderRadius="md"
              bg={getColor('background.dashboard.primary')}
              borderWidth="1px"
              borderColor={getColor('border.familyGroup.card')}
            >
              <Text fontSize="sm" color={getColor('text.familyGroup.secondary')}>
                {t('settlements.period')}: {formatYm(settlement.periodYm)}
              </Text>
              <Text fontSize="sm" color={getColor('text.familyGroup.secondary')}>
                {t('settlements.settledAt')}: {formatSettledAt(settlement.settledAt)}
              </Text>
              <Text fontSize="sm" color={getColor('text.familyGroup.secondary')}>
                {t('settlements.settledBy')}: {settlement.settledBy.name}
              </Text>
              <Text fontWeight="bold" color={getColor('text.coin')} mt={2}>
                {t('settlements.total')}: {displayAmount(settlement.totalSettled)}
              </Text>
            </Box>

            {settlement.members.length > 0 && (
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th color={getColor('text.dashboard.tileSubtitle')}>
                        {t('mesada.member')}
                      </Th>
                      <Th color={getColor('text.dashboard.tileSubtitle')} isNumeric>
                        {t('settlements.amount')}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {settlement.members.map((row) => (
                      <Tr key={row.member.id}>
                        <Td color={getColor('text.familyGroup.title')}>
                          <HStack>
                            <Text>{row.member.name}</Text>
                          </HStack>
                        </Td>
                        <Td
                          color={getColor('text.familyGroup.title')}
                          isNumeric
                          fontFamily={getFont('body')}
                        >
                          {displayAmount(row.totalAmount)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </>
        )}
      </VStack>
    </ChallengePageScaffold>
  );
};
