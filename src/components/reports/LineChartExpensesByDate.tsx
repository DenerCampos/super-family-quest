import { Flex, Text, Box, useBreakpointValue, Spinner } from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import type { ExpensesByDate } from '../../services/reports';
import { fillMonthDays, formatDateToBR } from '../../utils/formatDate';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface LineChartExpensesProps {
  startDate: string;
  endDate: string;
  userId?: string;
  data?: ExpensesByDate[];
  onDataUpdate?: (data: ExpensesByDate[]) => void;
}

interface ChartDataItem {
  date: string;
  formattedDate: string;
  formattedDateMobile: string;
  formattedDateDesktop: string;
  value: number;
}

const generateAreaColors = () => {
  return {
    stroke: 'hsl(270, 75%, 60%)',
    fill: 'hsl(270, 75%, 60%, 0.2)',
  };
};

export const LineChartExpensesByDate = ({ startDate, endDate, userId, data: initialData, onDataUpdate }: LineChartExpensesProps) => {
  const [data, setData] = useState(initialData ?? []);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getExpenseByDate({
          startDate,
          endDate,
          userId,
        });
        setData(response);
        onDataUpdate?.(response);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do gráfico:', err);
        setError(t('reports.expensesByDate.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, userId]);

  useEffect(() => {
    if (data.length > 0) {
      const fillChartData = fillMonthDays(data);
      const processedData = fillChartData.map((item) => ({
        date: item.date,
        formattedDate: formatDateToBR(item.date),
        formattedDateMobile: new Date(item.date).getDate().toString().padStart(2, '0'),
        formattedDateDesktop: formatDateToBR(item.date).split('/').slice(0, 2).join('/'),
        value: Number(item.value),
      }));
      setChartData(processedData);
    } else {
      setChartData([]);
    }
  }, [data]);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateAreaColors();

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
        {t('reports.expensesByDate.title')}
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
            {t('reports.expensesByDate.loading')}
          </Text>
        </Flex>
      ) : error ? (
        <Text color={getColor('status.error')} textAlign="center" py={10}>
          {error}
        </Text>
      ) : chartData.length > 0 ? (
        <Box width="100%" height={isMobile ? '300px' : '400px'}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={getColor('text.reports.primary')} />
              <XAxis
                dataKey={isMobile ? "formattedDateMobile" : "formattedDateDesktop"}
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
                formatter={(value) => [formatCurrency(Number(value)), t('reports.expensesByDate.value')]}
                labelFormatter={(value) => {
                  const fullDate = chartData.find(
                    (item) => item.formattedDate === value,
                  )?.date;
                  return fullDate ? formatDateToBR(fullDate) : value;
                }}
                contentStyle={{
                  background: getColor('background.reports'),
                  borderColor: getColor('border.reports'),
                  borderRadius: 'md',
                  padding: '8px',
                }}
              />
              {!isMobile && (
                <Legend
                  verticalAlign="top"
                  align="center"
                  wrapperStyle={{
                    paddingBottom: '20px',
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                name={t('reports.expensesByDate.spentValue')}
                stroke={colors.stroke}
                fill={colors.fill}
                strokeWidth={2}
                activeDot={{
                  stroke: colors.stroke,
                  strokeWidth: 2,
                  fill: getColor('background.reports'),
                  r: 4,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('text.reports.primary')} py={10} textAlign="center">
          {t('reports.expensesByDate.noData')}
        </Text>
      )}
    </Flex>
  );
};
