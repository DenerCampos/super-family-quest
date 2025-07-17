import { Flex, Text, Box, useBreakpointValue, Spinner } from '@chakra-ui/react';
import {
  LineChart,
  Line,
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

interface LineChartExpensesProps {
  data: ExpensesByDate[];
  onDataUpdate?: (data: ExpensesByDate[]) => void;
}

const generateLineColors = () => {
  // Tons de roxo principal com variações
  return [
    'hsl(270, 75%, 60%)', // Roxo principal
    'hsl(290, 65%, 60%)', // Violeta
    'hsl(250, 65%, 65%)', // Azul arroxeado
  ];
};

export const LineChartExpensesByDate = ({ data: initialData, onDataUpdate }: LineChartExpensesProps) => {
  const [startDate, setStartDate] = useState(defaultDates.firstDay);
  const [endDate, setEndDate] = useState(defaultDates.lastDay);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('Erro ao carregar dados das despesas');
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

  const fillChartData = fillMonthDays(data);
  const chartData = fillChartData.map((item) => ({
    date: item.date,
    formattedDate: formatDateToBR(item.date),
    formattedDateMobile: new Date(item.date).getDate().toString().padStart(2, '0'),
    formattedDateDesktop: formatDateToBR(item.date).split('/').slice(0, 2).join('/'),
    value: Number(item.value),
  }));

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateLineColors();

  return (
    <Flex
      direction="column"
      p={4}
      borderRadius="lg"
      border="2px solid"
      borderColor="purple.200"
      width="100%"
      maxW="600px"
      mx="auto"
      mb={6}
      bg="transparent"
      boxShadow="sm"
    >
      <Text
        fontSize="xl"
        color="purple.500"
        textAlign="center"
        mb={4}
        fontFamily="Pixelify Sans"
        fontWeight="bold"
      >
        Despesas por Data
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
            color="purple.500"
            thickness="4px"
            emptyColor="purple.100"
          />
          <Text ml={3} color="purple.300">
            Carregando despesas...
          </Text>
        </Flex>
      ) : error ? (
        <Text color="red.500" textAlign="center" py={10}>
          {error}
        </Text>
      ) : data.length > 0 ? (
        <Box width="100%" height={isMobile ? '300px' : '400px'}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="purple.100" />
              <XAxis
                dataKey={isMobile ? "formattedDateMobile" : "formattedDateDesktop"}
                stroke="purple.500"
                tick={{ fontSize: isMobile ? 12 : 14 }}
              />
              {!isMobile && (
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="purple.500"
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
                  background: 'purple.50',
                  borderColor: 'purple.200',
                  borderRadius: 'md',
                  color: 'purple.800',
                }}
              />
              {!isMobile && (
                <Legend
                  wrapperStyle={{
                    paddingTop: '10px',
                  }}
                  formatter={(value) => (
                    <span style={{ color: 'purple.700' }}>{value}</span>
                  )}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                name="Valor Gasto"
                stroke={colors[0]} // Cor principal da linha
                strokeWidth={1.5} // Reduzido de 3 para 1.5
                dot={{
                  stroke: colors[0], // Cor da borda do ponto
                  strokeWidth: 1, // Reduzido de 2 para 1
                  r: 2, // Reduzido de 3 para 2
                }}
                activeDot={{
                  stroke: colors[0],
                  strokeWidth: 2, // Reduzido de 3 para 2
                  fill: colors[0], // Adicionado preenchimento no hover
                  r: 4, // Reduzido de 5 para 4
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color="purple.300" py={10} textAlign="center">
          Nenhum dado de despesas disponível
        </Text>
      )}
    </Flex>
  );
};
