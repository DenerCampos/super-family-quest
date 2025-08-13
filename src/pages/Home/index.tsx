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
import { FiCamera, FiPlus, FiDollarSign, FiShoppingBag, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ExpenseModal } from '../../components/modals/ExpenseModal';
import { RevenueModal } from '../../components/modals/RevenueModal';
import { api } from '../../services';
import type { Expense, Groups, Merchant, Payments } from '../../services/resources';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertQRData } from '../../utils/qrCode';
import { CompleteProfileModal } from '../../components/modals/CompleteProfileModal';
import { SummaryCard } from '../../components/SummaryCard';
import { NewRecurringIncomeModal } from '../../components/modals/NewRecurringIncomeModal';
import { LastRegistrationsList } from '../../components/LastRegistrationsList';
import { NewRecurringExpenseModal } from '../../components/modals/NewRecurringExpenseModal';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

const Home = () => {
  const { profile, loadProfile, showValues, toggleShowValues } = useAuth();  
  const { getColor } = useVisualTheme();
  const { isOpen: isExpenseOpen, onOpen: onExpenseOpen, onClose: onExpenseClose } = useDisclosure();
  const { isOpen: isRevenueOpen, onOpen: onRevenueOpen, onClose: onRevenueClose } = useDisclosure();
  const [stores, setStores] = useState<Merchant[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [groups, setGroups] = useState<Groups[]>([]);
  const location = useLocation();
  const [scannedData, setScannedData] = useState<Expense | null>(null);
  const [scanError, setScanError] = useState('');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showRecurringRevenuesModal, setShowRecurringRevenuesModal] = useState(false);
  const [showRecurringExpensesModal, setShowRecurringExpensesModal] = useState(false);
  const [newRegistrationAdded, setNewRegistrationAdded] = useState(false);
  const navigate = useNavigate();
  const { t } = useThemedTranslation();
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

    if (profile && profile.hasRecurringRevenues) {
      setShowRecurringRevenuesModal(true);
    }

    if (profile && profile.hasRecurringExpenses) {
      setShowRecurringExpensesModal(true);
    }
  }, [profile]);

  const handleNewRegistration = () => {
    setNewRegistrationAdded(true);
  };

  const handleSuccess = async () => {
    await loadProfile();
  };

  const handleCloseRecurringExpensesModal = async () => {
    setShowRecurringExpensesModal(false);
    await loadProfile();
  };

  const handleCloseRecurringRevenuesModal = async () => {
    setShowRecurringRevenuesModal(false);
    await loadProfile();
  };

  return (
    <Flex direction="column" minH="100vh" pb="70px" bg="purple.50">
      <Header />

      {/* Conteúdo Principal */}
      <Flex direction="column" p={4} gap={4}>
        {/* Cards de Resumo */}
        <Flex direction="column" gap={4} position="relative">
          <Button
            position="absolute"
            right={2}
            top={2}
            size="sm"
            variant="ghost"
            bg={getColor('background.button.primary')}
            color={getColor('text.inverted')}
            _hover={{ bg: getColor('background.button.hover.neutral') }}
            onClick={toggleShowValues}
            zIndex={1}
          >
            <Icon as={showValues ? FiEyeOff : FiEye} />
          </Button>
          <SummaryCard
            title={t('home.summary.income')}
            value={profile?.income || 0}
            colorScheme="green"
          />
          <SummaryCard
            title={t('home.summary.expenses')}
            value={profile?.expenses || 0}
            colorScheme="red"
          />
        </Flex>

        {/* Menus de Ação */}
        <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
          <Menu>
            <MenuButton
              as={Button}
              bg={getColor('background.button.expense')}
              color={getColor('text.inverted')}
              _hover={{ bg: getColor('background.button.hover.expense') }}
              size="lg"
              leftIcon={<Icon as={FiShoppingBag} />}
              w="full"
            >
              {t('home.addExpense')}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiPlus />} onClick={onExpenseOpen}>
                {t('home.newExpense')}
              </MenuItem>
              <MenuItem icon={<FiCamera />} onClick={() => navigate('/scan')}>
                {t('home.scanQRCode')}
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              bg={getColor('background.button.revenue')}
              color={getColor('text.inverted')}
              _hover={{ bg: getColor('background.button.hover.revenue') }}
              size="lg"
              leftIcon={<Icon as={FiDollarSign} />}
              w="full"
            >
              {t('home.addRevenue')}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiPlus />} onClick={onRevenueOpen}>
                {t('home.newRevenue')}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <LastRegistrationsList
          newRegistrationAdded={newRegistrationAdded}
          setNewRegistrationAdded={setNewRegistrationAdded}
        />
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

      <NewRecurringIncomeModal
        isOpen={showRecurringRevenuesModal}
        onClose={handleCloseRecurringRevenuesModal}
      />

      <NewRecurringExpenseModal
        isOpen={showRecurringExpensesModal}
        onClose={handleCloseRecurringExpensesModal}
      />

      <NavigationBar />
    </Flex>
  );
};

export default Home;
