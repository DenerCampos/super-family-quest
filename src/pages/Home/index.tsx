import { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  Card,
  CardBody,
  Text,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { FiCamera, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { CouponModal } from '../../components/modals/CouponModal';
import { api } from '../../services';
import type { Coupom, Groups, Merchant, Payments } from '../../services/resources';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertQRData } from '../../utils/qrCode';

const Home = () => {
  const { user, loadProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stores, setStores] = useState<Merchant[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [groups, setGroups] = useState<Groups[]>([]);
  const location = useLocation();
  const [scannedData, setScannedData] = useState<Coupom | null>(null);
  const [scanError, setScanError] = useState('');
  const navigate = useNavigate();

  // Carregar dados para o modal
  useEffect(() => {
    const loadData = async () => {
      const [storesData, paymentsData, groupsData] = await Promise.all([
        api.resources.getStores(),
        api.resources.getPayments(),
        api.resources.getGroups(),
      ]);
      setStores(storesData);
      setPayments(paymentsData);
      setGroups(groupsData);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.scanned && location.state.couponData) {
      console.log('convertQRData', convertQRData(location.state.couponData));
      
      setScannedData(convertQRData(location.state.couponData));
      onOpen();
    }
    if (location.state?.error) {
      setScanError(location.state.error);
    }
  }, [location.state]);


  const handleSuccess = async () => {
    await loadProfile(); // Atualizar dados do usuário após cadastro
  };

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
          onClick={onOpen}
        >
          Adicionar Novo Cupom
        </Button>

        <Button
          colorScheme="teal"
          size="lg"
          leftIcon={<FiCamera />}
          w="full"
          boxShadow="md"
          onClick={() => navigate('/scan')}
        >
          Ler QR Code
        </Button>
      </Flex>

      {isOpen && (
        <CouponModal
          isOpen={isOpen}
          onClose={onClose}
          stores={stores}
          payments={payments}
          groups={groups}
          onSuccess={handleSuccess}
          initialData={scannedData}
          setScannedData={setScannedData}
        />
      )}

      <NavigationBar />
    </Flex>
  );
};

export default Home;
