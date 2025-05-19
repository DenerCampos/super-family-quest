import { Flex, Button, Card, CardBody, Text, Heading } from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

const Home = () => {
  const { user } = useAuth();

  return (
    <Flex direction="column" minH="100vh" pb="70px" bg="purple.50">
      <Header />

      {/* Conteúdo Principal */}
      <Flex direction="column" p={4} gap={4}>
        {/* Cards de Resumo */}
        <Card bg="green.100" borderLeft="4px solid" borderColor="green.500">
          <CardBody>
            <Text fontSize="sm" color="green.800">
              Receitas do Mês
            </Text>
            <Heading size="lg" color="green.900">
              {formatCurrency(user?.income ?? 0)}
            </Heading>
          </CardBody>
        </Card>

        <Card bg="red.100" borderLeft="4px solid" borderColor="red.500">
          <CardBody>
            <Text fontSize="sm" color="red.800">
              Despesas do Mês
            </Text>
            <Heading size="lg" color="red.900">
              {formatCurrency(user?.expenses ?? 0)}
            </Heading>
          </CardBody>
        </Card>

        {/* Botão de Ação Principal */}
        <Button
          colorScheme="purple"
          size="lg"
          leftIcon={<FiPlus />}
          w="full"
          mt={4}
          boxShadow="md"
        >
          Adicionar Novo Gasto
        </Button>
      </Flex>

      <NavigationBar />
    </Flex>
  );
};

export default Home;
