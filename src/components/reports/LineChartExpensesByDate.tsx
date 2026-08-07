import { Box, Flex, Grid, Spinner, Text, VStack } from '@chakra-ui/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useMemo, useRef } from 'react';
import type { ExpensesByDate } from '../../services/reports';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useExpensesByDate } from '../../hooks/useExpensesByDate';
import {
  formatCompactCurrencyAxis,
  formatCurrency,
} from '../../utils/formatCurrency';
import {
  fillDateRangeDays,
  formatDateToBR,
  formatDateToYYYYMMDD,
} from '../../utils/formatDate';
import { resolveChakraColor, withAlpha } from '../../utils/resolveColor';

interface LineChartExpensesProps {
  startDate: string;
  endDate: string;
  userId?: string;
  familyGroupId?: string;
  onDataUpdate?: (data: ExpensesByDate[]) => void;
}

interface ChartDataItem {
  date: string;
  formattedDate: string;
  formattedDateMobile: string;
  formattedDateDesktop: string;
  value: number;
}

export const LineChartExpensesByDate = ({
  startDate,
  endDate,
  userId,
  familyGroupId,
  onDataUpdate,
}: LineChartExpensesProps) => {
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();
  const { data = [], isLoading, isError } = useExpensesByDate({
    startDate,
    endDate,
    userId,
    familyGroupId,
  });

  // Estabiliza o callback com ref para não re-disparar o effect a cada render do pai
  const onDataUpdateRef = useRef(onDataUpdate);
  useEffect(() => {
    onDataUpdateRef.current = onDataUpdate;
  });

  useEffect(() => {
    if (data.length > 0) {
      onDataUpdateRef.current?.(data);
    }
  }, [data]);

  const rangeStart = formatDateToYYYYMMDD(startDate);
  const rangeEnd = formatDateToYYYYMMDD(endDate);

  const expenseColor = resolveChakraColor(
    getColor('text.lastRegistrations.expense'),
  );
  const areaFill = withAlpha(expenseColor, '33');

  const chartData = useMemo<ChartDataItem[]>(() => {
    if (!data.length || !rangeStart || !rangeEnd) {
      return [];
    }

    const normalized = data.map((item) => ({
      date: item.date,
      value: Number(item.value),
    }));

    return fillDateRangeDays(normalized, rangeStart, rangeEnd).map((item) => ({
      date: item.date,
      formattedDate: formatDateToBR(item.date),
      formattedDateMobile: new Date(item.date)
        .getDate()
        .toString()
        .padStart(2, '0'),
      formattedDateDesktop: formatDateToBR(item.date).split('/').slice(0, 2).join('/'),
      value: Number(item.value),
    }));
  }, [data, rangeStart, rangeEnd]);

  const stats = useMemo(() => {
    if (!chartData.length) {
      return null;
    }

    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const daysWithExpense = chartData.filter((item) => item.value > 0).length;
    const peak = chartData.reduce(
      (best, item) => (item.value > best.value ? item : best),
      chartData[0],
    );

    return {
      total,
      average: chartData.length > 0 ? total / chartData.length : 0,
      daysWithExpense,
      totalDays: chartData.length,
      peakValue: peak.value,
      peakDate: peak.date,
    };
  }, [chartData]);

  const hasAnyData = (stats?.total ?? 0) > 0;

  const xAxisInterval = chartData.length > 20 ? Math.floor(chartData.length / 15) : 0;

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
        {t('reports.expensesByDate.error')}
      </Text>
    );
  }

  if (!hasAnyData || !stats) {
    return (
      <Text
        color={getColor('text.dashboard.tileSubtitle')}
        textAlign="center"
        fontFamily={getFont('body')}
        py={8}
      >
        {t('reports.expensesByDate.noData')}
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
            {t('reports.expensesByDate.totalInPeriod')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={expenseColor}
            fontFamily={getFont('heading')}
          >
            {formatCurrency(stats.total)}
          </Text>
        </Box>
        <Box {...cardStyle} p={4}>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByDate.averagePerDay')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={expenseColor}
            fontFamily={getFont('heading')}
          >
            {formatCurrency(stats.average)}
          </Text>
        </Box>
      </Grid>

      <Grid templateColumns="1fr 1fr" gap={3}>
        <Box {...cardStyle} p={4}>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByDate.peakDay')}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={getColor('text.dashboard.tileTitle')}
            fontFamily={getFont('heading')}
          >
            {formatCurrency(stats.peakValue)}
          </Text>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.tileSubtitle')}
            mt={1}
            fontFamily={getFont('body')}
          >
            {formatDateToBR(stats.peakDate)}
          </Text>
        </Box>
        <Box {...cardStyle} p={4}>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByDate.daysWithExpense')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={getColor('text.dashboard.tileTitle')}
            fontFamily={getFont('heading')}
          >
            {stats.daysWithExpense}
          </Text>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.tileSubtitle')}
            mt={1}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesByDate.daysOfTotal', { total: stats.totalDays })}
          </Text>
        </Box>
      </Grid>

      <Box {...cardStyle} p={4}>
        <Box width="100%" height="320px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 8,
                right: 8,
                left: 4,
                bottom: 4,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={getColor('border.dashboard.tile')}
              />
              <XAxis
                dataKey="formattedDateMobile"
                stroke={getColor('text.dashboard.filterLabel')}
                tick={{ fontSize: 10 }}
                interval={xAxisInterval}
              />
              <YAxis
                tickFormatter={formatCompactCurrencyAxis}
                stroke={getColor('text.dashboard.filterLabel')}
                tick={{ fontSize: 10 }}
                width={48}
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  t('reports.expensesByDate.value'),
                ]}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload as ChartDataItem | undefined;
                  return item ? formatDateToBR(item.date) : '';
                }}
                contentStyle={{
                  background: getColor('background.dashboard.filterBar'),
                  borderColor: getColor('border.dashboard.tile'),
                  borderRadius: '8px',
                  padding: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={t('reports.expensesByDate.spentValue')}
                stroke={expenseColor}
                fill={areaFill}
                strokeWidth={2}
                activeDot={{
                  stroke: expenseColor,
                  strokeWidth: 2,
                  fill: getColor('background.dashboard.filterBar'),
                  r: 4,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </VStack>
  );
};
