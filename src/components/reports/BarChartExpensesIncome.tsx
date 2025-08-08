import { Flex, Text, Box, useBreakpointValue, Spinner, Select } from '@chakra-ui/react';
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

interface ExpenseIncomeData {
  month: string;
  totalExpenses: string;
  totalRevenues: string;
}

interface BarChartExpensesIncomeProps {
  data: ExpenseIncomeData[];
  onDataUpdate?: (data: ExpenseIncomeData[]) => void;
}

const generateBarColors = () => {
  return {
    expenses: 'hsl(350, 75%, 60%)', // Vermelho para despesas
    revenues: 'hsl(120, 75%, 60%)', // Verde para receitas
  };
};

const getCurrentYear = () => new Date().getFullYear();
const getAvailableYears = () => {
  const currentYear = getCurrentYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
};

export const BarChartExpensesIncome = ({ 
  data: initialData, 
  onDataUpdate 
}: BarChartExpensesIncomeProps) => {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear().toString());
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useThemedTranslation();
  const fetchData = async (year: string) => {
    setLoading(true);
    try {
      const response = await api.getExpensesIncomeComparison({
        year,
      });
      setData(response);
      onDataUpdate?.(response);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      setError(t('reports.expensesIncome.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const chartData = data.map(item => ({
    month: new Date(item.month + '-01').toLocaleString('pt-BR', { month: 'short' }).toUpperCase(),
    expenses: Number(item.totalExpenses),
    revenues: Number(item.totalRevenues),
  }));

  const isMobile = useBreakpointValue({ base: true, md: false });
  const colors = generateBarColors();

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
        fontWeight="bold"
      >
        {t('reports.expensesIncome.title')}
      </Text>

      <Select
        value={selectedYear}
        onChange={handleYearChange}
        mb={4}
        borderColor="purple.200"
        _hover={{ borderColor: 'purple.300' }}
        _focus={{ borderColor: 'purple.400' }}
      >
        {getAvailableYears().map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>

      {loading ? (
        <Flex align="center" justify="center" height="300px">
          <Spinner
            size="xl"
            color="purple.500"
            thickness="4px"
            emptyColor="purple.100"
          />
          <Text ml={3} color="purple.300">
            {t('reports.expensesIncome.loading')}
          </Text>
        </Flex>
      ) : error ? (
        <Text color="red.500" textAlign="center" py={10}>
          {error}
        </Text>
      ) : data.length > 0 ? (
        <Box width="100%" height={isMobile ? '300px' : '400px'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="purple.100" />
              <XAxis
                dataKey="month"
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
                formatter={(value) => [formatCurrency(Number(value)), '']}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderColor: 'purple.200',
                  borderRadius: 'md',
                  padding: '8px',
                }}
              />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{
                  paddingBottom: '20px',
                }}
              />
              <Bar
                dataKey="expenses"
                name="Despesas"
                fill={colors.expenses}
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
              />
              <Bar
                dataKey="revenues"
                name="Receitas"
                fill={colors.revenues}
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color="purple.300" py={10} textAlign="center">
          {t('reports.expensesIncome.noData')}
        </Text>
      )}
    </Flex>
  );
}; 