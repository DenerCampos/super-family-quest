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

interface TopProductsData {
  name: string;
  quantity: number;
  value: string;
}

interface HorizontalBarChartTopProductsProps {
  startDate: string;
  endDate: string;
  userId?: string;
  data?: TopProductsData[];
  onDataUpdate?: (data: TopProductsData[]) => void;
}

const generateBarColors = () => {
  return {
    quantity: 'hsl(270, 75%, 60%)',
    value: 'hsl(290, 65%, 60%)',
  };
};

export const HorizontalBarChartTopProducts = ({
  startDate,
  endDate,
  userId,
  data: initialData,
  onDataUpdate,
}: HorizontalBarChartTopProductsProps) => {
  const [data, setData] = useState(initialData ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getMostPurchasedItems({
          startDate,
          endDate,
          userId,
        });
        setData(response);
        onDataUpdate?.(response);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do gráfico:', err);
        setError(t('reports.topProducts.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, userId]);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateBarColors();

  const chartData = data.map((item) => ({
    name:
      isMobile && item.name.length > 15
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
        {t('reports.topProducts.title')}
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
                stroke={getColor('text.reports.primary')}
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
                    return [formatCurrency(Number(value)), t('reports.topProducts.totalValue')];
                  if (name === 'quantity') return [value, t('reports.topProducts.quantity')];
                  return [value, name];
                }}
                labelFormatter={(value) => {
                  const item = chartData.find((item) => item.name === value);
                  return item?.fullName || value;
                }}
                contentStyle={{
                  background: getColor('background.reports'),
                  borderColor: getColor('border.reports'),
                  borderRadius: 'md',
                  padding: '8px',
                }}
              />
              <Legend verticalAlign="top" align="center" />
              <Bar
                dataKey="quantity"
                name={t('reports.topProducts.quantity')}
                fill={colors.quantity}
                radius={[0, 4, 4, 0]}
                maxBarSize={25}
              />
              <Bar
                dataKey="value"
                name={t('reports.topProducts.totalValue')}
                fill={colors.value}
                radius={[0, 4, 4, 0]}
                maxBarSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('text.reports.primary')} py={10} textAlign="center">
          {t('reports.topProducts.noData')}
        </Text>
      )}
    </Flex>
  );
};
