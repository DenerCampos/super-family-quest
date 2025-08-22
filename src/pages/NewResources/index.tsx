import { useState, useEffect } from 'react';
import {
  Flex,
  Box,
  useDisclosure,
  useToast,
  Accordion,
} from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { SimpleResourceModal } from '../../components/modals/SimpleResourceModal';
import { ExpenseModal } from '../../components/modals/ExpenseModal';
import { RevenueModal } from '../../components/modals/RevenueModal';
import ResourceContainer from '../../components/resources/ResourceContainer';
import StoreResource from '../../components/resources/StoreResource';
import PaymentResource from '../../components/resources/PaymentResource';
import GroupResource from '../../components/resources/GroupResource';
import ExpenseResource from '../../components/resources/ExpenseResource';
import RevenueResource from '../../components/resources/RevenueResource';
import { api } from '../../services';
import type { Expense, Groups, Merchant, Payments, Revenue } from '../../services/resources';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

const NewResources = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const [stores, setStores] = useState<Merchant[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [groups, setGroups] = useState<Groups[]>([]);

  const [editingResource, setEditingResource] = useState<{
    type: 'store' | 'payment' | 'group' | 'expense' | 'revenue';
    data: any;
  } | null>(null);

  // Controles de trigger para atualização dos componentes
  const [refreshTriggers, setRefreshTriggers] = useState({
    store: 0,
    payment: 0,
    group: 0,
    expense: 0,
    revenue: 0,
  });

  const {
    isOpen: isSimpleOpen,
    onOpen: onSimpleOpen,
    onClose: onSimpleClose,
  } = useDisclosure();
  const {
    isOpen: isExpenseOpen,
    onOpen: onExpenseOpen,
    onClose: onExpenseClose,
  } = useDisclosure();
  const {
    isOpen: isRevenueOpen,
    onOpen: onRevenueOpen,
    onClose: onRevenueClose,
  } = useDisclosure();
  const [currentResource, setCurrentResource] = useState<
    'store' | 'payment' | 'group'
  >('store');
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      const paginate = {
        page: 1,
        limit: 100,
      }
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

  // Função para atualizar o trigger de refresh de um recurso específico
  const triggerRefresh = (
    resourceType: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
  ) => {
    setRefreshTriggers((prev) => ({
      ...prev,
      [resourceType]: prev[resourceType] + 1,
    }));
  };

  const handleResourceOpen = (
    resource: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
    itemToEdit?: Merchant | Payments | Groups | Expense | Revenue | null,
  ) => {
    // Fechar todos os modais primeiro
    onSimpleClose();
    onExpenseClose();
    onRevenueClose();

    // Configurar dados de edição se existirem
    if (itemToEdit && Object.keys(itemToEdit).length > 0) {
      setEditingResource({ type: resource, data: itemToEdit });
    } else {
      setEditingResource(null); // Novo item
    }

    // Abrir o modal apropriado
    if (resource === 'expense') {
      onExpenseOpen();
    } else if (resource === 'revenue') {
      onRevenueOpen();
    } else {
      setCurrentResource(resource);
      onSimpleOpen();
    }
  };

  const handleDelete = async (
    type: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
    id: string,
  ) => {
    try {
      // Implementar chamadas específicas para cada tipo
      switch (type) {
        case 'store':
          await api.deleteStore({ id });
          break;
        case 'payment':
          await api.deletePayment({ id });
          break;
        case 'group':
          await api.deleteGroup({ id });
          break;
        case 'expense':
          await api.deleteExpense({ id });
          break;
        case 'revenue':
          await api.deleteRevenue({ id });
          break;
      }

      // Atualizar a listagem do recurso específico
      triggerRefresh(type);

      toast({
        title: t('resources.deleteSuccess'),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('resources.deleteError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  // Função chamada quando um modal é fechado com sucesso
  const handleModalSuccess = (
    resourceType: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
  ) => {
    setEditingResource(null);
    triggerRefresh(resourceType);
  };

  return (
    <Flex direction="column" minH="100vh" bg={getColor('background.resources')}>
      <Header />

      <Box p={4} mb="70px">
        <Accordion allowMultiple>
          {/* Seção Cadastros */}
          <ResourceContainer title="Cadastros" colorScheme={getColor('primary')}>
            <StoreResource
              onEdit={(store) => handleResourceOpen('store', store)}
              onDelete={(id) => handleDelete('store', id)}
              refreshTrigger={refreshTriggers.store}
            />

            <PaymentResource
              onEdit={(payment) => handleResourceOpen('payment', payment)}
              onDelete={(id) => handleDelete('payment', id)}
              refreshTrigger={refreshTriggers.payment}
            />

            <GroupResource
              onEdit={(group) => handleResourceOpen('group', group)}
              onDelete={(id) => handleDelete('group', id)}
              refreshTrigger={refreshTriggers.group}
            />
          </ResourceContainer>

          {/* Seção Despesas */}
          <ResourceContainer
            title="Despesas"
            colorScheme={getColor('expense')}
          >
            <ExpenseResource
              onEdit={(expense) => handleResourceOpen('expense', expense)}
              onDelete={(id) => handleDelete('expense', id)}
              refreshTrigger={refreshTriggers.expense}
            />
          </ResourceContainer>

          {/* Seção Receitas */}
          <ResourceContainer
            title="Receitas"
            colorScheme={getColor('revenue')}
          >
            <RevenueResource
              onEdit={(revenue) => handleResourceOpen('revenue', revenue)}
              onDelete={(id) => handleDelete('revenue', id)}
              refreshTrigger={refreshTriggers.revenue}
            />
          </ResourceContainer>
        </Accordion>
      </Box>

      {/* Modal para recursos simples (store, payment, group) */}
      {isSimpleOpen && !!currentResource && (
        <SimpleResourceModal
          isOpen={isSimpleOpen}
          onClose={() => {
            onSimpleClose();
            setEditingResource(null);
          }}
          resourceType={currentResource}
          onSuccess={() => handleModalSuccess(currentResource)}
          initialData={
            editingResource?.type === currentResource
              ? editingResource.data
              : null
          }
        />
      )}

      {/* Modal para despesas */}
      {isExpenseOpen && (
        <ExpenseModal
          isOpen={isExpenseOpen}
          onClose={() => {
            onExpenseClose();
            setEditingResource(null);
          }}
          onSuccess={() => handleModalSuccess('expense')}
          stores={stores || []}
          payments={payments || []}
          groups={groups || []}
          initialData={
            editingResource?.type === 'expense' ? editingResource.data : null
          }
        />
      )}

      {/* Modal para receitas */}
      {isRevenueOpen && (
        <RevenueModal
          isOpen={isRevenueOpen}
          onClose={() => {
            onRevenueClose();
            setEditingResource(null);
          }}
          onSuccess={() => handleModalSuccess('revenue')}
          initialData={
            editingResource?.type === 'revenue' ? editingResource.data : null
          }
        />
      )}

      <NavigationBar />
    </Flex>
  );
};

export default NewResources;
