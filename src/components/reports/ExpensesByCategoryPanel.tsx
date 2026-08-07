import {
  Box,
  Divider,
  Flex,
  Grid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useExpensesByGroup } from '../../hooks/useExpensesByGroup';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { chakraColors } from '../../theme/themes';
import { formatCurrency } from '../../utils/formatCurrency';
import { resolveChakraColor } from '../../utils/resolveColor';

type Props = {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
};

type CategoryItem = {
  name: string;
  value: number;
};

const TOP_SLICE_COUNT = 5;

const CATEGORY_PALETTE = [
  chakraColors.red[500],
  chakraColors.red[400],
  chakraColors.orange[500],
  chakraColors.pink[500],
  chakraColors.orange[400],
  chakraColors.yellow[500],
  chakraColors.red[600],
  chakraColors.pink[400],
  chakraColors.purple[400],
  chakraColors.teal[500],
];

function getCategoryColor(index: number, others = false): string {
  if (others) {
    return chakraColors.gray[400];
  }
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}

function buildDonutData(
  items: CategoryItem[],
  othersLabel: string,
): CategoryItem[] {
  if (items.length <= TOP_SLICE_COUNT) {
    return items;
  }

  const top = items.slice(0, TOP_SLICE_COUNT);
  const othersValue = items
    .slice(TOP_SLICE_COUNT)
    .reduce((sum, item) => sum + item.value, 0);

  if (othersValue <= 0) {
    return top;
  }

  return [...top, { name: othersLabel, value: othersValue }];
}

export function ExpensesByCategoryPanel({
  startDate,
  endDate,
  userId,
  familyGroupId,
}: Props) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { data, isLoading, isError } = useExpensesByGroup({
    startDate,
    endDate,
    userId,
    familyGroupId,
  });

  const othersLabel = t('reports.expensesByGroup.others');

  const items = useMemo(() => {
    return (data ?? [])
      .map((item) => ({
        name: item.name,
        value: Number(item.value),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const totalValue = useMemo(
    () => items.reduce((sum, item) => sum + item.value, 0),
    [items],
  );

  const donutData = useMemo(
    () => buildDonutData(items, othersLabel),
    [items, othersLabel],
  );

  const topCategory = items[0] ?? null;

  const expenseColor = resolveChakraColor(
    getColor('text.lastRegistrations.expense'),
  );

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
        {t('reports.expensesByGroup.error')}
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
        {t('reports.expensesByGroup.noData')}
      </Text>
    );
  }

  return (
    <VStack align="stretch" spacing={3} width="100%" maxW="600px" mx="auto" mb={6}>
      <Grid templateColumns="1fr 1fr" gap={3}>
        <Box {...cardStyle} p={4}>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByGroup.totalInPeriod')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={expenseColor}
            fontFamily={getFont('heading')}
          >
            {formatCurrency(totalValue)}
          </Text>
        </Box>
        <Box {...cardStyle} p={4}>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByGroup.categoriesCount')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={getColor('text.dashboard.tileTitle')}
            fontFamily={getFont('heading')}
          >
            {items.length}
          </Text>
        </Box>
      </Grid>

      {topCategory && (
        <Box {...cardStyle} p={4}>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByGroup.topCategory')}
          </Text>
          <Flex justify="space-between" align="flex-start" gap={2} mt={1}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={getColor('text.dashboard.tileTitle')}
              fontFamily={getFont('body')}
              noOfLines={2}
            >
              {topCategory.name}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={expenseColor}
              fontFamily={getFont('heading')}
              flexShrink={0}
            >
              {formatCurrency(topCategory.value)}
            </Text>
          </Flex>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.tileSubtitle')}
            mt={1}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByGroup.shareOfTotal', {
              percent: Math.round((topCategory.value / totalValue) * 100),
            })}
          </Text>
        </Box>
      )}

      <Box {...cardStyle} p={4}>
        <Box position="relative" width="100%" height="220px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={88}
                dataKey="value"
                stroke={getColor('background.dashboard.filterBar')}
                strokeWidth={2}
              >
                {donutData.map((entry, index) => {
                  const isOthers = entry.name === othersLabel;
                  const colorIndex = isOthers
                    ? -1
                    : items.findIndex((item) => item.name === entry.name);
                  return (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={getCategoryColor(
                        colorIndex >= 0 ? colorIndex : 0,
                        isOthers,
                      )}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${formatCurrency(Number(value))} (${totalValue > 0 ? Math.round((Number(value) / totalValue) * 100) : 0}%)`,
                  name,
                ]}
                contentStyle={{
                  background: getColor('background.dashboard.filterBar'),
                  borderColor: getColor('border.dashboard.tile'),
                  borderRadius: '8px',
                  padding: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <Flex
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            direction="column"
            align="center"
            pointerEvents="none"
            maxW="90px"
            textAlign="center"
          >
            <Text
              fontSize="xs"
              color={getColor('text.dashboard.tileSubtitle')}
              fontFamily={getFont('body')}
            >
              {t('reports.expensesByGroup.totalInPeriod')}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={getColor('text.dashboard.tileTitle')}
              fontFamily={getFont('heading')}
              noOfLines={2}
            >
              {formatCurrency(totalValue)}
            </Text>
          </Flex>
        </Box>
      </Box>

      <Box {...cardStyle} overflow="hidden">
        {items.map((item, index) => {
          const shareOfTotal =
            totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
          const barWidth =
            totalValue > 0 ? (item.value / items[0].value) * 100 : 0;
          const color = getCategoryColor(index);

          return (
            <Box key={`${item.name}-${index}`}>
              {index > 0 && (
                <Divider borderColor={getColor('border.dashboard.tile')} />
              )}
              <Box p={4}>
                <Flex align="flex-start" gap={3}>
                  <Box
                    w="12px"
                    h="12px"
                    borderRadius="full"
                    bg={color}
                    flexShrink={0}
                    mt={1}
                  />
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
                        {formatCurrency(item.value)}
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
                        bg={color}
                        transition="width 0.3s ease"
                      />
                    </Box>
                    <Text
                      fontSize="xs"
                      color={getColor('text.dashboard.tileSubtitle')}
                      fontFamily={getFont('body')}
                      textAlign="right"
                    >
                      {t('reports.expensesByGroup.shareOfTotal', {
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
