import { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { FiCamera, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { CouponModal } from '../../components/modals/CouponModal';
import { api } from '../../services';
import type { Coupom, Groups, Merchant, Payments } from '../../services/resources';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertQRData } from '../../utils/qrCode';
import { CompleteProfileModal } from '../../components/modals/CompleteProfileModal';
import { SummaryCard } from '../../components/SummaryCard';

const Home = () => {
  const { user, loadProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stores, setStores] = useState<Merchant[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [groups, setGroups] = useState<Groups[]>([]);
  const location = useLocation();
  const [scannedData, setScannedData] = useState<Coupom | null>(null);
  const [scanError, setScanError] = useState('');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
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
      console.log(scanError);
      
    }
  }, [location.state]);

  useEffect(() => {
    if (user && user.isFirstAccess) {
      setShowCompleteProfile(true);
    }
  }, [user]);


  const handleSuccess = async () => {
    await loadProfile(); // Atualizar dados do usuário após cadastro
  };

  return (
    <Flex direction="column" minH="100vh" pb="70px" bg="purple.50">
      <Header />

      {/* Conteúdo Principal */}
      <Flex direction="column" p={4} gap={4}>
        {/* Cards de Resumo */}
        <Flex direction="column" gap={4}>
          <SummaryCard
            title="Receitas do Mês"
            value={user?.income || 0}
            colorScheme="green"
          />
          <SummaryCard
            title="Despesas do Mês"
            value={user?.expenses || 0}
            colorScheme="red"
          />
        </Flex>
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

      <CompleteProfileModal
        isOpen={showCompleteProfile}
        user={{
          email: user?.email || '',
          name: user?.name || '',
        }}
        onComplete={() => {
          setShowCompleteProfile(false);
          loadProfile(); // Atualiza os dados do usuário
        }}
      />

      <NavigationBar />
    </Flex>
  );
};

export default Home;
