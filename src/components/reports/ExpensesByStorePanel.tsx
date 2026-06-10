import { Box, Divider, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useExpensesByStore } from '../../hooks/useExpensesByStore';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { formatCurrency } from '../../utils/formatCurrency';
import { getRankBadgeColor } from '../../utils/rankBadge';

type Props = {
  startDate: string;
  endDate: string;
  userId?: string;
};

export function ExpensesByStorePanel({ startDate, endDate, userId }: Props) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { data, isLoading, isError } = useExpensesByStore({
    startDate,
    endDate,
    userId,
  });

  const items = data ?? [];

  const { maxValue, totalValue } = useMemo(() => {
    const vals = items.map((item) => Number(item.value));
    return {
      maxValue: vals.length ? Math.max(...vals) : 0,
      totalValue: vals.reduce((sum, v) => sum + v, 0),
    };
  }, [items]);

  const cardStyle = {
    borderRadius: 'lg',
    bg: getColor('background.dashboard.filterBar'),
    border: '1px solid',
    borderColor: getColor('border.dashboard.tile'),
  };

  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner color={getColor('text.dashboard.title')} />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Text
        color={getColor('status.error')}
        textAlign="center"
        fontFamily={getFont('body')}
      >
        {t('reports.expensesByStore.error')}
      </Text>
    );
  }

  if (items.length === 0) {
    return (
      <Text
        color={getColor('text.dashboard.tileSubtitle')}
        textAlign="center"
        fontFamily={getFont('body')}
        py={8}
      >
        {t('reports.expensesByStore.noData')}
      </Text>
    );
  }

  return (
    <VStack align="stretch" spacing={3} width="100%" maxW="600px" mx="auto" mb={6}>
      <Box {...cardStyle} p={4}>
        <Text
          fontSize="xs"
          color={getColor('text.dashboard.filterLabel')}
          fontFamily={getFont('body')}
        >
          {t('reports.expensesByStore.totalInPeriod')}
        </Text>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={getColor('text.dashboard.tileTitle')}
          fontFamily={getFont('heading')}
        >
          {formatCurrency(totalValue)}
        </Text>
        <Text
          fontSize="xs"
          color={getColor('text.dashboard.tileSubtitle')}
          mt={1}
          fontFamily={getFont('body')}
        >
          {t('reports.expensesByStore.storesCount', { count: items.length })}
        </Text>
      </Box>

      <Box {...cardStyle} overflow="hidden">
        {items.map((item, index) => {
          const rank = index + 1;
          const value = Number(item.value);
          const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const shareOfTotal =
            totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;

          return (
            <Box key={`${item.name}-${index}`}>
              {index > 0 && (
                <Divider borderColor={getColor('border.dashboard.tile')} />
              )}
              <Box p={4}>
                <Flex align="flex-start" gap={3}>
                  <Flex
                    align="center"
                    justify="center"
                    w="28px"
                    h="28px"
                    borderRadius="full"
                    bg={getRankBadgeColor(rank, getColor)}
                    flexShrink={0}
                    mt={0.5}
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color={
                        rank <= 3 ? 'white' : getColor('text.dashboard.tileTitle')
                      }
                      fontFamily={getFont('body')}
                    >
                      {rank}
                    </Text>
                  </Flex>

                  <Box flex={1} minW={0}>
                    <Flex
                      justify="space-between"
                      align="flex-start"
                      gap={2}
                      mb={2}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={getColor('text.dashboard.tileTitle')}
                        fontFamily={getFont('body')}
                        noOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={getColor('text.dashboard.tileTitle')}
                        fontFamily={getFont('heading')}
                        flexShrink={0}
                      >
                        {formatCurrency(value)}
                      </Text>
                    </Flex>

                    <Box
                      h="8px"
                      borderRadius="full"
                      bg={getColor('background.dashboard.primary')}
                      overflow="hidden"
                      mb={2}
                    >
                      <Box
                        h="full"
                        w={`${barWidth}%`}
                        borderRadius="full"
                        bg={getColor('border.dashboard.tileActive')}
                        transition="width 0.3s ease"
                      />
                    </Box>

                    <Text
                      fontSize="xs"
                      color={getColor('text.dashboard.tileSubtitle')}
                      fontFamily={getFont('body')}
                      textAlign="right"
                    >
                      {t('reports.expensesByStore.shareOfTotal', {
                        percent: shareOfTotal,
                      })}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Box>
    </VStack>
  );
}
