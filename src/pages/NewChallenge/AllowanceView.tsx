import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
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

export const AllowanceView = () => {
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { profile, showValues } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const groupId = familyGroup?.id;
  const userId = profile?.user.id ?? '';
  const userIsAdmin = familyGroup ? isAdmin(familyGroup, userId) : false;

  const [filterYear, setFilterYear] = useState(() => new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(() => new Date().getMonth() + 1);

  const pendingQuery = useQuery({
    queryKey: choreQueryKeys.payrollPending(groupId ?? '', filterYear, filterMonth),
    queryFn: () =>
      api.choreGetPayrollPending(groupId!, {
        year: filterYear,
        month: filterMonth,
      }),
    enabled: !!groupId,
  });

  const suggestionQuery = useQuery({
    queryKey: choreQueryKeys.payrollSuggestion(groupId ?? ''),
    queryFn: () => api.choreGetPayrollSuggestion(groupId!),
    enabled: !!groupId && userIsAdmin,
  });

  const settleMutation = useMutation({
    mutationFn: (periodYm: number) =>
      api.choreSettlePayroll(groupId!, { periodYm }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      onClose();
      toast({ title: t('mesada.settledSuccess'), status: 'success' });
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast({
          title: t('mesada.settlementConflict'),
          status: 'warning',
        });
        return;
      }
      toast({
        title: t('common.error'),
        description: t('mesada.settleError'),
        status: 'error',
      });
    },
  });

  const periodToSettle = pendingQuery.data?.periodYm;
  const canSettle =
    userIsAdmin &&
    periodToSettle != null &&
    (pendingQuery.data?.totalPending ?? 0) > 0 &&
    (pendingQuery.data?.members.length ?? 0) > 0;

  const formatYm = (ym: number) => {
    const y = Math.floor(ym / 100);
    const m = ym % 100;
    return `${String(m).padStart(2, '0')}/${y}`;
  };

  const displayAmount = (n: number) => {
    const safe = typeof n === 'number' && Number.isFinite(n) ? n : 0;
    return showValues ? formatCurrency(safe) : '••••••';
  };

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.allowance.title')}
        isLoading
      />
    );
  }

  if (!familyGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.allowance.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  const pending = pendingQuery.data;

  return (
    <ChallengePageScaffold title={t('newChallenge.tiles.allowance.title')}>
      <VStack align="stretch" spacing={4} pb={8}>
        <MonthYearInput
          year={filterYear}
          month={filterMonth}
          onChange={({ year, month: m }) => {
            setFilterYear(year);
            setFilterMonth(m);
          }}
        />

        {userIsAdmin && suggestionQuery.data && (
          <Box
            p={3}
            borderRadius="md"
            bg={getColor('background.dashboard.primary')}
            borderWidth="1px"
            borderColor={getColor('border.familyGroup.card')}
          >
            <Text
              fontWeight="bold"
              fontFamily={getFont('body')}
              mb={1}
              color={getColor('text.dashboard.title')}
            >
              {t('mesada.suggestionTitle')}
            </Text>
            <Text fontSize="sm" color={getColor('text.familyGroup.primary')}>
              {suggestionQuery.data.message}
            </Text>
            <Text fontSize="xs" color={getColor('text.dashboard.tileSubtitle')} mt={1}>
              {t('mesada.suggestedPeriod', {
                period: formatYm(suggestionQuery.data.suggestedPeriodYm),
              })}
            </Text>
          </Box>
        )}

        {pendingQuery.isLoading ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>{t('common.loading')}</Text>
        ) : !pending ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>{t('mesada.empty')}</Text>
        ) : (
          <>
            <Text fontWeight="bold" color={getColor('text.coin')}>
              {t('mesada.totalPending')}:{' '}
              {displayAmount(pending.totalPending)}
            </Text>
            <Text fontSize="sm" color={getColor('text.familyGroup.secondary')}>
              {t('mesada.periodYm')}: {formatYm(pending.periodYm)}
            </Text>

            {userIsAdmin && pending.members.length > 0 && (
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th color={getColor('text.dashboard.tileSubtitle')}>
                        {t('mesada.member')}
                      </Th>
                      <Th color={getColor('text.dashboard.tileSubtitle')} isNumeric>
                        {t('mesada.pending')}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pending.members.map((row) => (
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
                          {displayAmount(row.totalPending)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}

            {!userIsAdmin && pending.members[0] && (
              <Box>
                <Text color={getColor('text.dashboard.tileSubtitle')}>
                  {pending.members[0].member.name}
                </Text>
                <Text fontWeight="bold" color={getColor('text.coin')}>
                  {displayAmount(pending.members[0].totalPending)}
                </Text>
              </Box>
            )}
          </>
        )}

        {canSettle && (
          <Button
            bg={getColor('button.background.primary')}
            color={getColor('button.text.primary')}
            onClick={onOpen}
          >
            {t('mesada.settleCta', { period: formatYm(periodToSettle) })}
          </Button>
        )}
      </VStack>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent bg={getColor('background.primary')}>
          <AlertDialogHeader color={getColor('text.familyGroup.title')}>
            {t('mesada.settleConfirmTitle')}
          </AlertDialogHeader>
          <AlertDialogBody color={getColor('text.dashboard.tileSubtitle')}>
            {periodToSettle != null
              ? t('mesada.settleConfirmBody', {
                  period: formatYm(periodToSettle),
                })
              : null}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t('common.close')}
            </Button>
            <Button
              bg={getColor('button.background.primary')}
              color={getColor('button.text.primary')}
              ml={3}
              onClick={() => {
                if (periodToSettle != null) {
                  settleMutation.mutate(periodToSettle);
                }
              }}
              isLoading={settleMutation.isPending}
            >
              {t('mesada.settleConfirmAction')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ChallengePageScaffold>
  );
};
