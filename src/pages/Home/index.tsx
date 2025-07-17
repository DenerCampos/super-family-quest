import { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { FiCamera, FiPlus, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ExpenseModal } from '../../components/modals/ExpenseModal';
import { RevenueModal } from '../../components/modals/RevenueModal';
import { api } from '../../services';
import type { Expense, Groups, Merchant, Payments } from '../../services/resources';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertQRData } from '../../utils/qrCode';
import { CompleteProfileModal } from '../../components/modals/CompleteProfileModal';
import { SummaryCard } from '../../components/SummaryCard';
import { NewMonthIncomeModal } from '../../components/modals/NewMonthIncomeModal';
import { LastRegistrationsList } from '../../components/LastRegistrationsList';

const Home = () => {
  const { profile, loadProfile } = useAuth();
  const { isOpen: isExpenseOpen, onOpen: onExpenseOpen, onClose: onExpenseClose } = useDisclosure();
  const { isOpen: isRevenueOpen, onOpen: onRevenueOpen, onClose: onRevenueClose } = useDisclosure();
  const [stores, setStores] = useState<Merchant[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [groups, setGroups] = useState<Groups[]>([]);
  const location = useLocation();
  const [scannedData, setScannedData] = useState<Expense | null>(null);
  const [scanError, setScanError] = useState('');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showNewMonthModal, setShowNewMonthModal] = useState(false);
  const [newRegistrationAdded, setNewRegistrationAdded] = useState(false);
  const navigate = useNavigate();

  // Carregar dados para o modal
  useEffect(() => {
    const loadData = async () => {
      const paginate = {
        page: 1,
        limit: 100,
      };
      const [storesData, paymentsData, groupsData] = await Promise.all([
        api.getStores(paginate),
        api.getPayments(paginate),
        api.getGroups(paginate),
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
      onExpenseOpen();
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

        {/* Menus de Ação */}
        <Flex 
          gap={4} 
          direction={{ base: "column", md: "row" }}
        >
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="purple"
              size="lg"
              leftIcon={<Icon as={FiShoppingBag} />}
              w="full"
            >
              Adicionar Despesa
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<FiPlus />}
                onClick={onExpenseOpen}
              >
                Nova Despesa
              </MenuItem>
              <MenuItem
                icon={<FiCamera />}
                onClick={() => navigate('/scan')}
              >
                Ler QR Code
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              colorScheme="green"
              size="lg"
              leftIcon={<Icon as={FiDollarSign} />}
              w="full"
            >
              Adicionar Receita
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<FiPlus />}
                onClick={onRevenueOpen}
              >
                Nova Receita
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <LastRegistrationsList newRegistrationAdded={newRegistrationAdded} setNewRegistrationAdded={setNewRegistrationAdded} />
      </Flex>

      {isExpenseOpen && (
        <ExpenseModal
          isOpen={isExpenseOpen}
          onClose={onExpenseClose}
          stores={stores}
          payments={payments}
          groups={groups}
          onSuccess={handleSuccess}
          initialData={scannedData}
          setScannedData={setScannedData}
          handleNewRegistration={handleNewRegistration}
        />
      )}

      {isRevenueOpen && (
        <RevenueModal
          isOpen={isRevenueOpen}
          onClose={onRevenueClose}
          onSuccess={handleSuccess}
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
          loadProfile();
        }}
      />

      <NewMonthIncomeModal
        isOpen={showNewMonthModal}
        onClose={handleConfirmNewMonth}
      />

      <NavigationBar />
    </Flex>
  );
};

export default Home;
