import { Flex, Text, SimpleGrid, Spinner } from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { useEffect, useState } from 'react';
import { api } from '../../services';
import { PieChartExpenses } from '../../components/reports/PieChartExpensesByGroup';
import { BarChartExpensesByStore } from '../../components/reports/BarChartExpensesByStore';
import { getMonthRange } from '../../utils/formatDate';
import type { ExpensesByDate, ExpensesByGroup, ExpensesByStore } from '../../services/reports';
import { LineChartExpensesByDate } from '../../components/reports/LineChartExpensesByDate';

const Dashboard = () => {
  const [expensesData, setExpensesData] = useState<ExpensesByGroup[]>([]);
  const [storesData, setStoresData] = useState<ExpensesByStore[]>([]);
  const [expensesByDate, setExpensesByDate] = useState<ExpensesByDate[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [errorGroups, setErrorGroups] = useState<string | null>(null);
  const [errorStores, setErrorStores] = useState<string | null>(null);
  const [errorExpenses, setErrorExpenses] = useState<string | null>(null);

  useEffect(() => {
    const loadExpensesByGroup = async () => {
      try {
        const { startDate, endDate } = getMonthRange(new Date());
        const data = await api.getExpenseByGroup({ startDate, endDate });
        setExpensesData(data);
        setErrorGroups(null);
      } catch (error) {
        console.error('Erro ao carregar dados por grupo:', error);
        setErrorGroups('Erro ao carregar dados de categorias');
      } finally {
        setLoadingGroups(false);
      }
    };

    const loadExpensesByStore = async () => {
      try {
        const { startDate, endDate } = getMonthRange(new Date());
        const data = await api.getExpenseByStore({ startDate, endDate });
        setStoresData(data);
        setErrorStores(null);
      } catch (error) {
        console.error('Erro ao carregar dados por loja:', error);
        setErrorStores('Erro ao carregar dados de lojas');
      } finally {
        setLoadingStores(false);
      }
    };

    const loadExpensesByDate = async () => {
      try {
        const { startDate, endDate } = getMonthRange(new Date());
        const data = await api.getExpenseByDate({ startDate, endDate });
        console.log(data);
        
        setExpensesByDate(data);
        setErrorExpenses(null);
      } catch (error) {
        console.error('Erro ao carregar dados por data:', error);
        setErrorExpenses('Erro ao carregar dados das despesas');
      } finally {
        setLoadingExpenses(false);
      }
    };

    // Carrega os dados independentemente
    loadExpensesByGroup();
    loadExpensesByStore();
    loadExpensesByDate();
  }, []);

  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="flex-start"
        pt={8}
        pb={20}
        px={4}
      >
        <SimpleGrid columns={1} spacing={6} width="100%" maxW="1200px">
          {/* Gráfico de Categorias */}
          <Flex direction="column" align="center">
            {loadingGroups ? (
              <Flex align="center" justify="center" height="300px">
                <Spinner
                  size="xl"
                  color="purple.500"
                  thickness="4px"
                  emptyColor="purple.100"
                />
                <Text ml={3} color="purple.300">
                  Carregando categorias...
                </Text>
              </Flex>
            ) : errorGroups ? (
              <Text color="red.500" textAlign="center" py={10}>
                {errorGroups}
              </Text>
            ) : expensesData.length > 0 ? (
              <PieChartExpenses data={expensesData} />
            ) : (
              <Text color="purple.300" py={10}>
                Nenhum dado de categorias disponível
              </Text>
            )}
          </Flex>

          {/* Gráfico de Lojas */}
          <Flex direction="column" align="center">
            {loadingStores ? (
              <Flex align="center" justify="center" height="300px">
                <Spinner
                  size="xl"
                  color="purple.500"
                  thickness="4px"
                  emptyColor="purple.100"
                />
                <Text ml={3} color="purple.300">
                  Carregando lojas...
                </Text>
              </Flex>
            ) : errorStores ? (
              <Text color="red.500" textAlign="center" py={10}>
                {errorStores}
              </Text>
            ) : storesData.length > 0 ? (
              <BarChartExpensesByStore data={storesData} />
            ) : (
              <Text color="purple.300" py={10}>
                Nenhum dado de lojas disponível
              </Text>
            )}
          </Flex>

          {/* Gráfico de despesas por data */}
          <Flex direction="column" align="center">
            {loadingExpenses ? (
              <Flex align="center" justify="center" height="300px">
                <Spinner
                  size="xl"
                  color="purple.500"
                  thickness="4px"
                  emptyColor="purple.100"
                />
                <Text ml={3} color="purple.300">
                  Carregando lojas...
                </Text>
              </Flex>
            ) : errorExpenses ? (
              <Text color="red.500" textAlign="center" py={10}>
                {errorExpenses}
              </Text>
            ) : expensesByDate.length > 0 ? (
              <LineChartExpensesByDate data={expensesByDate} />
            ) : (
              <Text color="purple.300" py={10}>
                Nenhum dado de lojas disponível
              </Text>
            )}
          </Flex>
        </SimpleGrid>
      </Flex>

      <NavigationBar />
    </Flex>
  );
};

export default Dashboard;
