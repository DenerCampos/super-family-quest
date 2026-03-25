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
  Cell,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import type { ExpensesByGroup } from '../../services/reports';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface ColumnChartExpensesProps {
  startDate: string;
  endDate: string;
  userId?: string;
  data?: ExpensesByGroup[];
  onDataUpdate?: (data: ExpensesByGroup[]) => void;
}

const generateBarColors = (count: number) => {
  const colors = [];
  const baseHue = 270;

  for (let i = 0; i < count; i++) {
    const hue = baseHue + ((i * 10) % 30);
    const lightness = 60 + (i % 4) * 5;
    colors.push(`hsl(${hue}, 65%, ${lightness}%)`);
  }

  return colors;
};

export const BarChartExpensesByStore = ({ startDate, endDate, userId, data: initialData, onDataUpdate }: ColumnChartExpensesProps) => {
  const [data, setData] = useState(initialData ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getExpenseByStore({
          startDate,
          endDate,
          userId,
        });
        setData(response);
        onDataUpdate?.(response);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do gráfico:', err);
        setError(t('reports.expensesByStore.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, userId]);

  const chartData = data.map((item) => ({
    name: item.name.length > 10 ? `${item.name.substring(0, 8)}...` : item.name,
    fullName: item.name,
    value: Number(item.value),
  }));

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateBarColors(data.length);

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
        {t('reports.expensesByStore.title')}
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
            {t('reports.expensesByStore.loading')}
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
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={getColor('chakraColors.gray.200')}
              />
              <XAxis
                dataKey="name"
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
                formatter={(value) => [formatCurrency(Number(value)), t('reports.expensesByStore.value')]}
                labelFormatter={(value) => {
                  const fullName = chartData.find(
                    (item) => item.name === value,
                  )?.fullName;
                  return fullName || value;
                }}
                contentStyle={{
                  background: getColor('background.quaternary'),
                  borderColor: getColor('border.reports'),
                  borderRadius: 'md',
                  color: getColor('text.reports.primary'),
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '10px',
                }}
                formatter={(value) => (
                  <span style={{ color: getColor('text.reports.primary') }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="value"
                name={t('reports.expensesByStore.value')}
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index]}
                    stroke={getColor('text.reports.primary')}
                    strokeWidth={0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('text.reports.primary')} py={10} textAlign="center">
          {t('reports.expensesByStore.noData')}
        </Text>
      )}
    </Flex>
  );
};
