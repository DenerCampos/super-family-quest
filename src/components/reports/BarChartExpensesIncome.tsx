import { Box, Flex, Grid, Spinner, Text, VStack } from '@chakra-ui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useMemo, useRef } from 'react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useExpensesIncomeComparison } from '../../hooks/useExpensesIncomeComparison';
import type { ExpensesIncomeComparison } from '../../services/reports';
import {
  formatCompactCurrencyAxis,
  formatCurrency,
} from '../../utils/formatCurrency';
import { resolveChakraColor } from '../../utils/resolveColor';

interface BarChartExpensesIncomeProps {
  year: string;
  userId?: string;
  familyGroupId?: string;
  onDataUpdate?: (data: ExpensesIncomeComparison[]) => void;
}

export const BarChartExpensesIncome = ({
  year,
  userId,
  familyGroupId,
  onDataUpdate,
}: BarChartExpensesIncomeProps) => {
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();
  const { data = [], isLoading, isError } = useExpensesIncomeComparison({
    year,
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

  const expenseColor = resolveChakraColor(
    getColor('text.lastRegistrations.expense'),
  );
  const revenueColor = resolveChakraColor(
    getColor('text.lastRegistrations.revenue'),
  );

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        month: new Date(`${item.month}-01T12:00:00`)
          .toLocaleString('pt-BR', { month: 'short' })
          .replace('.', '')
          .toUpperCase(),
        expenses: Number(item.totalExpenses),
        revenues: Number(item.totalRevenues),
      })),
    [data],
  );

  const totals = useMemo(() => {
    const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
    const totalRevenues = chartData.reduce((sum, item) => sum + item.revenues, 0);
    return {
      totalExpenses,
      totalRevenues,
      balance: totalRevenues - totalExpenses,
    };
  }, [chartData]);

  const hasAnyData = totals.totalExpenses > 0 || totals.totalRevenues > 0;

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
        {t('reports.expensesIncome.error')}
      </Text>
    );
  }

  if (!hasAnyData) {
    return (
      <Text
        color={getColor('text.dashboard.tileSubtitle')}
        textAlign="center"
        fontFamily={getFont('body')}
        py={8}
      >
        {t('reports.expensesIncome.noData')}
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
            {t('reports.expensesIncome.totalExpenses')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={expenseColor}
            fontFamily={getFont('heading')}
          >
            {formatCurrency(totals.totalExpenses)}
          </Text>
        </Box>
        <Box {...cardStyle} p={4}>
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.expensesIncome.totalIncome')}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={revenueColor}
            fontFamily={getFont('heading')}
          >
            {formatCurrency(totals.totalRevenues)}
          </Text>
        </Box>
      </Grid>

      <Box {...cardStyle} p={4}>
        <Text
          fontSize="xs"
          color={getColor('text.dashboard.filterLabel')}
          fontFamily={getFont('body')}
        >
          {t('reports.expensesIncome.balance')}
        </Text>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={totals.balance >= 0 ? revenueColor : expenseColor}
          fontFamily={getFont('heading')}
        >
          {formatCurrency(totals.balance)}
        </Text>
      </Box>

      <Box {...cardStyle} p={4}>
        <Box width="100%" height="320px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                dataKey="month"
                stroke={getColor('text.dashboard.filterLabel')}
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis
                tickFormatter={formatCompactCurrencyAxis}
                stroke={getColor('text.dashboard.filterLabel')}
                tick={{ fontSize: 10 }}
                width={48}
              />
              <Tooltip
                formatter={(value, name) => {
                  const label =
                    name === 'expenses'
                      ? t('reports.expensesIncome.expenses')
                      : t('reports.expensesIncome.income');
                  return [formatCurrency(Number(value)), label];
                }}
                contentStyle={{
                  background: getColor('background.dashboard.filterBar'),
                  borderColor: getColor('border.dashboard.tile'),
                  borderRadius: '8px',
                  padding: '8px',
                }}
              />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
              />
              <Bar
                dataKey="expenses"
                name={t('reports.expensesIncome.expenses')}
                fill={expenseColor}
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="revenues"
                name={t('reports.expensesIncome.income')}
                fill={revenueColor}
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </VStack>
  );
};
