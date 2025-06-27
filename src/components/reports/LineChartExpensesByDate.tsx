import { Flex, Text, Box, useBreakpointValue } from '@chakra-ui/react';
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

interface LineChartExpensesProps {
  data: ExpensesByDate[];
}

const generateLineColors = () => {
  // Tons de roxo principal com variações
  return [
    'hsl(270, 75%, 60%)', // Roxo principal
    'hsl(290, 65%, 60%)', // Violeta
    'hsl(250, 65%, 65%)', // Azul arroxeado
  ];
};

export const LineChartExpensesByDate = ({ data }: LineChartExpensesProps) => {
  const fillChartData = fillMonthDays(data);
  const chartData = fillChartData.map((item) => ({
    date: item.date,
    formattedDate: formatDateToBR(item.date),
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
              dataKey="formattedDate"
              stroke="purple.500"
              tick={{ fontSize: isMobile ? 12 : 14 }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              stroke="purple.500"
            />
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
              strokeWidth={3}
              dot={{
                stroke: colors[0], // Cor da borda do ponto
                strokeWidth: 2,
                // fill: 'transparent', // Sem preenchimento
                r: 3, // Raio menor (tamanho do ponto)
              }}
              activeDot={{
                stroke: colors[0],
                strokeWidth: 3,
                fill: 'transparent', // Sem preenchimento no hover
                r: 5, // Raio ligeiramente maior no hover
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Flex>
  );
};
