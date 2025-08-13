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
import { DateRangeFilter, defaultDates } from './DateRangeFilter';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface LineChartExpensesProps {
  data: ExpensesByDate[];
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

export const LineChartExpensesByDate = ({ data: initialData, onDataUpdate }: LineChartExpensesProps) => {
  const [startDate, setStartDate] = useState(defaultDates.firstDay);
  const [endDate, setEndDate] = useState(defaultDates.lastDay);
  const [data, setData] = useState(initialData);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  const fetchData = async (start: string, end: string) => {
    setLoading(true);
    try {
      const response = await api.getExpenseByDate({
        startDate: start,
        endDate: end,
      });
      setData(response);
      onDataUpdate?.(response);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      setError(t('reports.expensesByDate.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

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

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateAreaColors();

  return (
    <Flex
      direction="column"
      p={4}
      borderRadius="lg"
      border="2px solid"
      borderColor={getColor('primary.200')}
      width="100%"
      maxW="600px"
      mx="auto"
      mb={6}
      bg="transparent"
      boxShadow="sm"
    >
      <Text
        fontSize="xl"
        color={getColor('primary.500')}
        textAlign="center"
        mb={4}
        fontWeight="bold"
      >
        {t('reports.expensesByDate.title')}
      </Text>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />

      {loading ? (
        <Flex align="center" justify="center" height="300px">
          <Spinner
            size="xl"
            color={getColor('primary.500')}
            thickness="4px"
            emptyColor={getColor('primary.100')}
          />
          <Text ml={3} color={getColor('primary.300')}>
            {t('reports.expensesByDate.loading')}
          </Text>
        </Flex>
      ) : error ? (
        <Text color="red.500" textAlign="center" py={10}>
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
              <CartesianGrid strokeDasharray="3 3" stroke={getColor('primary.100')} />
              <XAxis
                dataKey={isMobile ? "formattedDateMobile" : "formattedDateDesktop"}
                stroke={getColor('primary.500')}
                tick={{ fontSize: isMobile ? 12 : 14 }}
              />
              {!isMobile && (
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke={getColor('primary.500')}
                />
              )}
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
                labelFormatter={(value) => {
                  const fullDate = chartData.find(
                    (item) => item.formattedDate === value,
                  )?.date;
                  return fullDate ? formatDateToBR(fullDate) : value;
                }}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderColor: getColor('primary.200'),
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
                name="Valor Gasto"
                stroke={colors.stroke}
                fill={colors.fill}
                strokeWidth={2}
                activeDot={{
                  stroke: colors.stroke,
                  strokeWidth: 2,
                  fill: 'white',
                  r: 4,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('primary.300')} py={10} textAlign="center">
          {t('reports.expensesByDate.noData')}
        </Text>
      )}
    </Flex>
  );
};
