import { Flex, Text, Box, useBreakpointValue } from '@chakra-ui/react';
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

interface ColumnChartExpensesProps {
  data: ExpensesByGroup[];
}

const generateBarColors = (count: number) => {
  // Tons de roxo com variação de luminosidade
  const colors = [];
  const baseHue = 270; // Tom base de roxo

  for (let i = 0; i < count; i++) {
    const hue = baseHue + ((i * 10) % 30); // Pequena variação de matiz
    const lightness = 60 + (i % 4) * 5; // Varia entre 60-75%
    colors.push(`hsl(${hue}, 65%, ${lightness}%)`);
  }

  return colors;
};

export const BarChartExpensesByStore = ({ data }: ColumnChartExpensesProps) => {
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
        Despesas por Categoria
      </Text>

      <Box width="100%" height={isMobile ? '300px' : '400px'}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            // layout="vertical" // Remove esta linha para ter barras verticais
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="purple.100" />
            <XAxis
              dataKey="name"
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
                const fullName = chartData.find(
                  (item) => item.name === value,
                )?.fullName;
                return fullName || value;
              }}
              contentStyle={{
                background: 'purple.50',
                borderColor: 'purple.200',
                borderRadius: 'md',
                color: 'purple.800',
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
              }}
              formatter={(value) => (
                <span style={{ color: 'purple.700' }}>{value}</span>
              )}
            />
            <Bar
              dataKey="value"
              name="Valor"
              radius={[4, 4, 0, 0]} // Bordas arredondadas só no topo
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index]}
                  stroke="purple.800"
                  strokeWidth={0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Flex>
  );
};
