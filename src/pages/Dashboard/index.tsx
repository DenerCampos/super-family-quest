import { Flex, SimpleGrid } from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { PieChartExpenses } from '../../components/reports/PieChartExpensesByGroup';
import { BarChartExpensesByStore } from '../../components/reports/BarChartExpensesByStore';
import { LineChartExpensesByDate } from '../../components/reports/LineChartExpensesByDate';

const Dashboard = () => {
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
          <PieChartExpenses data={[]} />
          <BarChartExpensesByStore data={[]} />
          <LineChartExpensesByDate data={[]} />
        </SimpleGrid>
      </Flex>

      <NavigationBar />
    </Flex>
  );
};

export default Dashboard;
