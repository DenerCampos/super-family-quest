import { Flex, Text, Box, useBreakpointValue } from "@chakra-ui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ExpensesByGroup } from "../../services/reports";

interface PieChartExpensesProps {
  data: ExpensesByGroup[];
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

export const PieChartExpenses = ({ data }: PieChartExpensesProps) => {
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
      borderColor="purple.200" // Bordas alinhadas ao tema
      width="100%"
      maxW="600px"
      mx="auto"
      mb={6}
      bg="transparent" // Garante fundo transparente
      boxShadow="sm" // Sombra sutil para profundidade
    >
      <Text
        fontSize="xl"
        color="purple.500" // Cor mais forte para melhor contraste
        textAlign="center"
        mb={4}
        fontFamily="Pixelify Sans"
        fontWeight="bold"
      >
        Distribuição de Gastos
      </Text>

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
                borderColor: 'purple.200',
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
                  <span style={{ color: 'purple.700' }}>{value}</span>
                )}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </Box>
      {isMobile && (
        <Box mt={4} maxH="150px" overflowY="auto">
          <Flex direction="column" gap={2}>
            {chartData.map((entry, index) => (
              <Flex key={`legend-${index}`} align="center" gap={2}>
                <Box w="12px" h="12px" borderRadius="50%" bg={colors[index]} />
                <Text color="purple.700" fontSize="sm">{entry.name}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};