import { Flex, Text, Box, useBreakpointValue, Spinner } from "@chakra-ui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ExpensesByGroup } from "../../services/reports";
import { useState, useEffect } from "react";
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface PieChartExpensesProps {
  startDate: string;
  endDate: string;
  userId?: string;
  data?: ExpensesByGroup[];
  onDataUpdate?: (data: ExpensesByGroup[]) => void;
}

const generateDistinctColors = (count: number) => {
  const baseHues = [260, 200, 320, 160, 230, 290];
  const colors = [];

  for (let i = 0; i < count; i++) {
    const hue = baseHues[i % baseHues.length] + i * 3;
    const saturation = 65 + (i % 3) * 10;
    const lightness = 70 - (i % 2) * 5;

    colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`);
  }

  return colors;
};

export const PieChartExpenses = ({ startDate, endDate, userId, data: initialData, onDataUpdate }: PieChartExpensesProps) => {
  const [data, setData] = useState(initialData ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getExpenseByGroup({
          startDate,
          endDate,
          userId,
        });
        setData(response);
        onDataUpdate?.(response);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do gráfico:', err);
        setError(t('reports.expensesByGroup.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, userId]);

  const chartData = data.map((item) => ({
    name: item.name,
    value: Number(item.value),
  }));

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateDistinctColors(data.length);

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
        {t('reports.expensesByGroup.title')}
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
            {t('reports.expensesByGroup.loading')}
          </Text>
        </Flex>
      ) : error ? (
        <Text color={getColor('status.error')} textAlign="center" py={10}>
          {error}
        </Text>
      ) : data.length > 0 ? (
        <Box width="100%" height={isMobile ? '300px' : '400px'}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isMobile ? 80 : 100}
                fill={getColor('text.reports.primary')}
                dataKey="value"
                label={({ name, percent }) =>
                  isMobile
                    ? `${((percent || 0) * 100).toFixed(0)}%`
                    : `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                animationDuration={500}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index]}
                    stroke={getColor('background.reports')}
                    strokeWidth={1.5}
                    strokeOpacity={0.6}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${formatCurrency(Number(value))} (${(
                    (Number(value) /
                      chartData.reduce((acc, curr) => acc + curr.value, 0)) *
                    100
                  ).toFixed(0)}%)`,
                  name,
                ]}
                contentStyle={{
                  background: getColor('background.reports'),
                  borderColor: getColor('border.reports'),
                  borderRadius: 'md',
                  padding: '8px',
                  color: getColor('text.reports.primary'),
                }}
              />
              {!isMobile && (
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                  formatter={(value) => (
                    <span style={{ color: getColor('text.reports.primary') }}>
                      {value}
                    </span>
                  )}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('text.reports.primary')} py={10} textAlign="center">
          {t('reports.expensesByGroup.noData')}
        </Text>
      )}
      {isMobile && data.length > 0 && (
        <Box mt={4} maxH="150px" overflowY="auto">
          <Flex direction="column" gap={2}>
            {chartData.map((entry, index) => (
              <Flex key={`legend-${index}`} align="center" gap={2}>
                <Box w="12px" h="12px" borderRadius="50%" bg={colors[index]} />
                <Text color={getColor('text.reports.primary')} fontSize="sm">
                  {entry.name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};
