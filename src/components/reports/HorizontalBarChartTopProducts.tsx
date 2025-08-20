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
import { DateRangeFilter, defaultDates } from './DateRangeFilter';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface TopProductsData {
  name: string;
  quantity: number;
  value: string;
}

interface HorizontalBarChartTopProductsProps {
  data: TopProductsData[];
  onDataUpdate?: (data: TopProductsData[]) => void;
}

const generateBarColors = () => {
  return {
    quantity: 'hsl(270, 75%, 60%)', // Roxo para quantidade
    value: 'hsl(290, 65%, 60%)', // Violeta para valor
  };
};

export const HorizontalBarChartTopProducts = ({ 
  data: initialData, 
  onDataUpdate 
}: HorizontalBarChartTopProductsProps) => {
  const [startDate, setStartDate] = useState(defaultDates.firstDay);
  const [endDate, setEndDate] = useState(defaultDates.lastDay);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  const fetchData = async (start: string, end: string) => {
    setLoading(true);
    try {
      const response = await api.getMostPurchasedItems({
        startDate: start,
        endDate: end,
      });
      setData(response);
      onDataUpdate?.(response);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      setError(t('reports.topProducts.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateBarColors();

  // Processa os dados para o gráfico
  const chartData = data.map(item => ({
    name: isMobile && item.name.length > 15 
      ? `${item.name.substring(0, 13)}...` 
      : item.name.length > 30 
      ? `${item.name.substring(0, 28)}...` 
      : item.name,
    fullName: item.name,
    quantity: item.quantity,
    value: Number(item.value),
  }));

  return (
    <Flex
      direction="column"
      p={4}
      borderRadius="lg"
      border="2px solid"
      borderColor={getColor('border.primary')}
      width="100%"
      maxW="600px"
      mx="auto"
      mb={6}
      bg={getColor('background.reports')}
      boxShadow="sm"
    >
      <Text
        fontSize="xl"
        color={getColor('text.reports')}
        textAlign="center"
        mb={4}
        fontWeight="bold"
      >
        {t('reports.topProducts.title')}
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
            color={getColor('text.accent')}
            thickness="4px"
            emptyColor={getColor('text.accent')}
          />
          <Text ml={3} color={getColor('text.accent')}>
            {t('reports.topProducts.loading')}
          </Text>
        </Flex>
      ) : error ? (
        <Text color={getColor('status.error')} textAlign="center" py={10}>
          {error}
        </Text>
      ) : data.length > 0 ? (
        <Box width="100%" height={isMobile ? '400px' : '500px'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: isMobile ? 80 : 120,
                bottom: 20,
              }}
              barSize={20}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={getColor('text.accent')}
              />
              <XAxis
                type="number"
                tickFormatter={(value) => value.toString()}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={isMobile ? 120 : 180}
                tick={{
                  fontSize: isMobile ? 10 : 12,
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'value')
                    return [formatCurrency(Number(value)), 'Valor Total'];
                  if (name === 'quantity') return [value, 'Quantidade'];
                  return [value, name];
                }}
                labelFormatter={(value) => {
                  const item = chartData.find((item) => item.name === value);
                  return item?.fullName || value;
                }}
                contentStyle={{
                  background: getColor('background.reports'),
                  borderColor: getColor('border.primary'),
                  borderRadius: 'md',
                  padding: '8px',
                }}
              />
              <Legend verticalAlign="top" align="center" />
              <Bar
                dataKey="quantity"
                name="Quantidade"
                fill={colors.quantity}
                radius={[0, 4, 4, 0]}
                maxBarSize={25}
              />
              <Bar
                dataKey="value"
                name="Valor Total"
                fill={colors.value}
                radius={[0, 4, 4, 0]}
                maxBarSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('text.accent')} py={10} textAlign="center">
          {t('reports.topProducts.noData')}
        </Text>
      )}
    </Flex>
  );
}; 