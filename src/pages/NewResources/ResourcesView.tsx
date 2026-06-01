import {
  Accordion,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { PageScaffold } from '../../components/PageScaffold';
import { SimpleResourceModal } from '../../components/modals/SimpleResourceModal';
import ExpenseResource from '../../components/resources/ExpenseResource';
import GroupResource from '../../components/resources/GroupResource';
import PaymentResource from '../../components/resources/PaymentResource';
import RecurringExpenseResource from '../../components/resources/RecurringExpenseResource';
import RecurringRevenueResource from '../../components/resources/RecurringRevenueResource';
import ResourceContainer from '../../components/resources/ResourceContainer';
import RevenueResource from '../../components/resources/RevenueResource';
import StoreResource from '../../components/resources/StoreResource';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import type {
  Expense,
  Groups,
  Merchant,
  Payments,
  Revenue,
} from '../../services/resources';

export const ResourcesView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();

  const [editingResource, setEditingResource] = useState<{
    type: 'store' | 'payment' | 'group' | 'expense' | 'revenue';
    data: Merchant | Payments | Groups | Expense | Revenue;
  } | null>(null);

  const [refreshTriggers, setRefreshTriggers] = useState({
    store: 0,
    payment: 0,
    group: 0,
    expense: 0,
    revenue: 0,
  });

  const [totalCounts, setTotalCounts] = useState({
    store: null as number | null,
    payment: null as number | null,
    group: null as number | null,
    expense: null as number | null,
    revenue: null as number | null,
    recurringExpense: null as number | null,
    recurringRevenue: null as number | null,
  });

  const updateCount = (key: keyof typeof totalCounts, value: number) => {
    setTotalCounts((prev) => ({ ...prev, [key]: value }));
  };

  const registrationsCount =
    (totalCounts.store ?? 0) +
    (totalCounts.payment ?? 0) +
    (totalCounts.group ?? 0);

  const {
    isOpen: isSimpleOpen,
    onOpen: onSimpleOpen,
    onClose: onSimpleClose,
  } = useDisclosure();

  const [currentResource, setCurrentResource] = useState<
    'store' | 'payment' | 'group'
  >('store');

  const triggerRefresh = (
    resourceType: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
  ) => {
    setRefreshTriggers((prev) => ({
      ...prev,
      [resourceType]: prev[resourceType] + 1,
    }));
  };

  const handleResourceOpen = (
    resource: 'store' | 'payment' | 'group',
    itemToEdit?: Merchant | Payments | Groups | Expense | Revenue | null,
  ) => {
    onSimpleClose();
    if (itemToEdit && Object.keys(itemToEdit).length > 0) {
      setEditingResource({ type: resource, data: itemToEdit });
    } else {
      setEditingResource(null);
    }
    setCurrentResource(resource);
    onSimpleOpen();
  };

  const handleDelete = async (
    type: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
    id: string,
  ) => {
    try {
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
      triggerRefresh(type);
      toast({
        title: t('newResources.deleteSuccess'),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('newResources.deleteError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const handleModalSuccess = (
    resourceType: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
  ) => {
    setEditingResource(null);
    triggerRefresh(resourceType);
  };

  return (
    <PageScaffold
      title={t('newResources.tiles.resources.title')}
      backTo="/new-resources"
      bg={getColor('background.resources')}
      contentLayout="plain"
      contentPx={0}
      contentPt={4}
    >
      <Accordion allowMultiple px={4}>
        <ResourceContainer
          title={t('resources.registrations')}
          colorScheme={getColor('primary')}
          count={registrationsCount || null}
        >
          <StoreResource
            onEdit={(store) => handleResourceOpen('store', store)}
            onDelete={(id) => handleDelete('store', id)}
            refreshTrigger={refreshTriggers.store}
            onTotalChange={(n) => updateCount('store', n)}
          />
          <PaymentResource
            onEdit={(payment) => handleResourceOpen('payment', payment)}
            onDelete={(id) => handleDelete('payment', id)}
            refreshTrigger={refreshTriggers.payment}
            onTotalChange={(n) => updateCount('payment', n)}
          />
          <GroupResource
            onEdit={(group) => handleResourceOpen('group', group)}
            onDelete={(id) => handleDelete('group', id)}
            refreshTrigger={refreshTriggers.group}
            onTotalChange={(n) => updateCount('group', n)}
          />
        </ResourceContainer>

        <ResourceContainer
          title={t('resources.expense.title')}
          colorScheme={getColor('expense')}
          count={totalCounts.expense}
        >
          <ExpenseResource
            onDelete={(id) => handleDelete('expense', id)}
            refreshTrigger={refreshTriggers.expense}
            onTotalChange={(n) => updateCount('expense', n)}
          />
        </ResourceContainer>

        <ResourceContainer
          title={t('resources.revenue.title')}
          colorScheme={getColor('revenue')}
          count={totalCounts.revenue}
        >
          <RevenueResource
            onDelete={(id) => handleDelete('revenue', id)}
            refreshTrigger={refreshTriggers.revenue}
            onTotalChange={(n) => updateCount('revenue', n)}
          />
        </ResourceContainer>

        <ResourceContainer
          title={t('recurring.expenseTitle')}
          colorScheme={getColor('expense')}
          count={totalCounts.recurringExpense}
        >
          <RecurringExpenseResource
            onDelete={(id) => handleDelete('expense', id)}
            refreshTrigger={refreshTriggers.expense}
            onTotalChange={(n) => updateCount('recurringExpense', n)}
          />
        </ResourceContainer>

        <ResourceContainer
          title={t('recurring.revenueTitle')}
          colorScheme={getColor('revenue')}
          count={totalCounts.recurringRevenue}
        >
          <RecurringRevenueResource
            onDelete={(id) => handleDelete('revenue', id)}
            refreshTrigger={refreshTriggers.revenue}
            onTotalChange={(n) => updateCount('recurringRevenue', n)}
          />
        </ResourceContainer>
      </Accordion>

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
            editingResource?.type === currentResource &&
            editingResource.data.id
              ? {
                  id: editingResource.data.id,
                  name: editingResource.data.name,
                }
              : undefined
          }
        />
      )}
    </PageScaffold>
  );
};
