import { Flex, Text, Box, useBreakpointValue, Spinner } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface ExpenseIncomeData {
  month: string;
  totalExpenses: string;
  totalRevenues: string;
}

interface BarChartExpensesIncomeProps {
  year: string;
  userId?: string;
  data?: ExpenseIncomeData[];
  onDataUpdate?: (data: ExpenseIncomeData[]) => void;
}

const generateBarColors = () => {
  return {
    expenses: 'hsl(350, 75%, 60%)',
    revenues: 'hsl(120, 75%, 60%)',
  };
};

export const BarChartExpensesIncome = ({
  year,
  userId,
  data: initialData,
  onDataUpdate,
}: BarChartExpensesIncomeProps) => {
  const [data, setData] = useState(initialData ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getExpensesIncomeComparison({ year, userId });
        setData(response);
        onDataUpdate?.(response);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do gráfico:', err);
        setError(t('reports.expensesIncome.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, userId]);

  const chartData = data.map((item) => ({
    month: new Date(item.month + '-01')
      .toLocaleString('pt-BR', { month: 'short' })
      .toUpperCase(),
    expenses: Number(item.totalExpenses),
    revenues: Number(item.totalRevenues),
  }));

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateBarColors();

  return (
    <Flex
      direction="column"
      p={4}
      borderRadius="lg"
      border="2px solid"
      borderColor={getColor('border.reports')}
      width="100%"
      maxW="600px"
      mx="auto"
      mb={6}
      bg={getColor('background.reports')}
      boxShadow="sm"
    >
      <Text
        fontSize="xl"
        color={getColor('text.reports.title')}
        textAlign="center"
        mb={4}
        fontWeight="bold"
      >
        {t('reports.expensesIncome.title')}
      </Text>

      {loading ? (
        <Flex align="center" justify="center" height="300px">
          <Spinner
            size="xl"
            color={getColor('text.reports.primary')}
            thickness="4px"
            emptyColor={getColor('text.reports.primary')}
          />
          <Text ml={3} color={getColor('text.reports.primary')}>
            {t('reports.expensesIncome.loading')}
          </Text>
        </Flex>
      ) : error ? (
        <Text color={getColor('status.error')} textAlign="center" py={10}>
          {error}
        </Text>
      ) : data.length > 0 ? (
        <Box width="100%" height={isMobile ? '300px' : '400px'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={getColor('text.reports.primary')}
              />
              <XAxis
                dataKey="month"
                stroke={getColor('text.reports.primary')}
                tick={{ fontSize: isMobile ? 12 : 14 }}
              />
              {!isMobile && (
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke={getColor('text.reports.primary')}
                />
              )}
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), '']}
                contentStyle={{
                  background: getColor('background.reports'),
                  borderColor: getColor('border.reports'),
                  borderRadius: 'md',
                  padding: '8px',
                }}
              />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{
                  paddingBottom: '20px',
                }}
              />
              <Bar
                dataKey="expenses"
                name={t('reports.expensesIncome.expenses')}
                fill={colors.expenses}
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
              />
              <Bar
                dataKey="revenues"
                name={t('reports.expensesIncome.income')}
                fill={colors.revenues}
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('text.reports.primary')} py={10} textAlign="center">
          {t('reports.expensesIncome.noData')}
        </Text>
      )}
    </Flex>
  );
};
