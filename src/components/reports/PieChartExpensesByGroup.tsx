import { Flex, Text, Box, useBreakpointValue, Spinner } from "@chakra-ui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ExpensesByGroup } from "../../services/reports";
import { DateRangeFilter, defaultDates } from "./DateRangeFilter";
import { useState, useEffect } from "react";
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
interface PieChartExpensesProps {
  data: ExpensesByGroup[];
  onDataUpdate?: (data: ExpensesByGroup[]) => void;
}

const generateDistinctColors = (count: number) => {
  // Cores suaves com variação de matiz, saturação e luminosidade
  const baseHues = [260, 200, 320, 160, 230, 290]; // Tons de roxo, azul e violeta
  const colors = [];

  for (let i = 0; i < count; i++) {
    const hue = baseHues[i % baseHues.length] + i * 3; // Pequena variação
    const saturation = 65 + (i % 3) * 10; // Entre 65-85%
    const lightness = 70 - (i % 2) * 5; // Entre 65-70% (tons pastel)

    colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`); // Com leve transparência
  }

  return colors;
};

export const PieChartExpenses = ({ data: initialData, onDataUpdate }: PieChartExpensesProps) => {
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
      const response = await api.getExpenseByGroup({
        startDate: start,
        endDate: end,
      });
      setData(response);
      onDataUpdate?.(response);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      setError(t('reports.expensesByGroup.error'));
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
      borderColor={getColor('primary.200')} // Bordas alinhadas ao tema
      width="100%"
      maxW="600px"
      mx="auto"
      mb={6}
      bg="transparent" // Garante fundo transparente
      boxShadow="sm" // Sombra sutil para profundidade
    >
      <Text
        fontSize="xl"
        color={getColor('primary.500')} // Cor mais forte para melhor contraste
        textAlign="center"
        mb={4}
        fontWeight="bold"
      >
        {t('reports.expensesByGroup.title')}
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
            {t('reports.expensesByGroup.loading')}
          </Text>
        </Flex>
      ) : error ? (
        <Text color="red.500" textAlign="center" py={10}>
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
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  isMobile ? 
                  `${((percent || 0) * 100).toFixed(0)}%` :
                  `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                animationDuration={500} // Microinteração
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index]}
                    stroke="white" // Bordas brancas suaves
                    strokeWidth={1.5}
                    strokeOpacity={0.6}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${formatCurrency(Number(value))} (${((Number(value) / chartData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(0)}%)`,
                  name
                ]}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderColor: getColor('primary.200'),
                  borderRadius: 'md',
                  padding: '8px',
                }}
              />
              {!isMobile && (
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                  formatter={(value) => (
                    <span style={{ color: getColor('primary.700') }}>{value}</span>
                  )}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color={getColor('primary.300')} py={10} textAlign="center">
          {t('reports.expensesByGroup.noData')}
        </Text>
      )}
      {isMobile && (
        <Box mt={4} maxH="150px" overflowY="auto">
          <Flex direction="column" gap={2}>
            {chartData.map((entry, index) => (
              <Flex key={`legend-${index}`} align="center" gap={2}>
                <Box w="12px" h="12px" borderRadius="50%" bg={colors[index]} />
                <Text color={getColor('primary.700')} fontSize="sm">{entry.name}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};