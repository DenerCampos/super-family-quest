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
import { NewMonthIncomeModal } from '../../components/modals/NewMonthIncomeModal';
import { LastRegistrationsList } from '../../components/LastRegistrationsList';

const Home = () => {
  const { profile, loadProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stores, setStores] = useState<Merchant[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [groups, setGroups] = useState<Groups[]>([]);
  const location = useLocation();
  const [scannedData, setScannedData] = useState<Coupom | null>(null);
  const [scanError, setScanError] = useState('');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showNewMonthModal, setShowNewMonthModal] = useState(false);
  const [newRegistrationAdded, setNewRegistrationAdded] = useState(false);
  const navigate = useNavigate();

  // Carregar dados para o modal
  useEffect(() => {
    const loadData = async () => {
      const [storesData, paymentsData, groupsData] = await Promise.all([
        api.getStores(),
        api.getPayments(),
        api.getGroups(),
      ]);
      setStores(storesData.data);
      setPayments(paymentsData.data);
      setGroups(groupsData.data);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.scanned && location.state.couponData) {      
      setScannedData(convertQRData(location.state.couponData));
      onOpen();
    }
    if (location.state?.error) {
      setScanError(location.state.error);
      console.error(scanError);
      
    }
  }, [location.state]);

  useEffect(() => {
    if (profile && profile.isFirstAccess) {
      setShowCompleteProfile(true);
    }

    if (profile && profile.newMonth) {
      setShowNewMonthModal(true);
    }
  }, [profile]);

  const handleNewRegistration = () => {
    setNewRegistrationAdded(true);
  };

  const handleSuccess = async () => {
    await loadProfile();
  };

  const handleEditIncomes = () => {
    setShowNewMonthModal(false);
    navigate('/new-resources');
  };

  const handleConfirmNewMonth = async () => {
    setShowNewMonthModal(false);
    await loadProfile();
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
            value={profile?.income || 0}
            colorScheme="green"
          />
          <SummaryCard
            title="Despesas do Mês"
            value={profile?.expenses || 0}
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
          Adicionar Nova Despesa
        </Button>
        <Button
          colorScheme="teal"
          size="lg"
          leftIcon={<FiCamera />}
          w="full"
          boxShadow="md"
          onClick={() => navigate('/scan')}
        >
          Ler QR Code da Despesa
        </Button>

        <LastRegistrationsList newRegistrationAdded={newRegistrationAdded} setNewRegistrationAdded={setNewRegistrationAdded} />
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
          handleNewRegistration={handleNewRegistration}
        />
      )}

      <CompleteProfileModal
        isOpen={showCompleteProfile}
        user={{
          email: profile?.user.email || '',
          name: profile?.user.name || '',
        }}
        onComplete={() => {
          setShowCompleteProfile(false);
          loadProfile(); // Atualiza os dados do usuário
        }}
      />

      {/* Novo Modal para Receitas de Novo Mês */}
      <NewMonthIncomeModal
        isOpen={showNewMonthModal}
        onClose={handleConfirmNewMonth}
        onEdit={handleEditIncomes}
      />

      <NavigationBar />
    </Flex>
  );
};

export default Home;
