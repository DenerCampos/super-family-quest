import {
  Box,
  Flex,
  Grid,
  Spinner,
  Text,
  Button,
  Divider,
} from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useCoinStatement } from '../../hooks/useCoinStatement';
import type { CoinTransactionItem } from '../../types/coinStatement';

type CoinStatementPanelProps = {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
  showMemberName: boolean;
  page: number;
  onPageChange: (page: number) => void;
};

function isCredit(type: CoinTransactionItem['transactionType']): boolean {
  return type === 'earn' || type === 'bonus' || type === 'refund';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CoinStatementPanel({
  startDate,
  endDate,
  userId,
  familyGroupId,
  showMemberName,
  page,
  onPageChange,
}: CoinStatementPanelProps) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { data, isLoading, isError } = useCoinStatement({
    startDate,
    endDate,
    userId,
    familyGroupId,
    page,
  });

  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner color={getColor('text.dashboard.title')} />
      </Flex>
    );
  }

  if (isError || !data) {
    return (
      <Text
        color={getColor('status.error')}
        textAlign="center"
        fontFamily={getFont('body')}
      >
        {t('reports.coinStatement.error')}
      </Text>
    );
  }

  const { totals, data: items, meta } = data;

  return (
    <Flex direction="column" gap={4}>
      <Grid templateColumns="1fr 1fr" gap={3}>
        <Box
          p={4}
          borderRadius="lg"
          bg={getColor('background.dashboard.filterBar')}
          border="1px solid"
          borderColor={getColor('border.dashboard.tile')}
        >
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
            mb={1}
          >
            {t('reports.coinStatement.totalEarned')}
          </Text>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={getColor('status.success')}
            fontFamily={getFont('heading')}
          >
            +{totals.totalEarned}
          </Text>
        </Box>
        <Box
          p={4}
          borderRadius="lg"
          bg={getColor('background.dashboard.filterBar')}
          border="1px solid"
          borderColor={getColor('border.dashboard.tile')}
        >
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
            mb={1}
          >
            {t('reports.coinStatement.totalSpent')}
          </Text>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={getColor('status.error')}
            fontFamily={getFont('heading')}
          >
            -{totals.totalSpent}
          </Text>
        </Box>
      </Grid>

      <Box
        borderRadius="lg"
        bg={getColor('background.dashboard.filterBar')}
        border="1px solid"
        borderColor={getColor('border.dashboard.tile')}
        overflow="hidden"
      >
        {items.length === 0 ? (
          <Text
            p={6}
            textAlign="center"
            color={getColor('text.dashboard.statementMeta')}
            fontFamily={getFont('body')}
          >
            {t('reports.coinStatement.noData')}
          </Text>
        ) : (
          items.map((item, index) => {
            const credit = isCredit(item.transactionType);
            return (
              <Box key={item.id}>
                {index > 0 && (
                  <Divider borderColor={getColor('border.dashboard.tile')} />
                )}
                <Flex
                  px={4}
                  py={3}
                  justify="space-between"
                  align="flex-start"
                  gap={3}
                >
                  <Box flex={1} minW={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      fontFamily={getFont('body')}
                      color={getColor('text.dashboard.title')}
                      noOfLines={2}
                    >
                      {item.description ?? t('reports.coinStatement.noDescription')}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={getColor('text.dashboard.statementMeta')}
                      fontFamily={getFont('body')}
                      mt={1}
                    >
                      {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
                      {showMemberName ? ` · ${item.userName}` : ''}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={getColor('text.dashboard.filterLabel')}
                      fontFamily={getFont('body')}
                      mt={1}
                    >
                      {t('reports.coinStatement.balanceAfter', {
                        value: item.balanceAfter,
                      })}
                    </Text>
                  </Box>
                  <Text
                    fontWeight="bold"
                    fontFamily={getFont('heading')}
                    color={
                      credit
                        ? getColor('status.success')
                        : getColor('status.error')
                    }
                    whiteSpace="nowrap"
                  >
                    {credit ? '+' : '-'}
                    {item.amount}
                  </Text>
                </Flex>
              </Box>
            );
          })
        )}
      </Box>

      {meta.totalPages > 1 && (
        <Flex justify="space-between" align="center">
          <Button
            size="sm"
            variant="outline"
            isDisabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            borderColor={getColor('border.dashboard.tile')}
            color={getColor('text.dashboard.filterLabel')}
          >
            {t('reports.coinStatement.previous')}
          </Button>
          <Text
            fontSize="sm"
            color={getColor('text.dashboard.statementMeta')}
            fontFamily={getFont('body')}
          >
            {t('reports.coinStatement.pageOf', {
              current: meta.currentPage,
              total: meta.totalPages,
            })}
          </Text>
          <Button
            size="sm"
            variant="outline"
            isDisabled={page >= meta.totalPages}
            onClick={() => onPageChange(page + 1)}
            borderColor={getColor('border.dashboard.tile')}
            color={getColor('text.dashboard.filterLabel')}
          >
            {t('reports.coinStatement.next')}
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
