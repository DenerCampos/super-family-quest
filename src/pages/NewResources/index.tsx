import {
  Accordion,
  Badge,
  Flex,
  Icon,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPackage, FiUsers, FiMail, FiSettings } from 'react-icons/fi';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { SimpleResourceModal } from '../../components/modals/SimpleResourceModal';
import ExpenseResource from '../../components/resources/ExpenseResource';
import GroupResource from '../../components/resources/GroupResource';
import PaymentResource from '../../components/resources/PaymentResource';
import RecurringExpenseResource from '../../components/resources/RecurringExpenseResource';
import RecurringRevenueResource from '../../components/resources/RecurringRevenueResource';
import ResourceContainer from '../../components/resources/ResourceContainer';
import RevenueResource from '../../components/resources/RevenueResource';
import StoreResource from '../../components/resources/StoreResource';
import { CreateGroupForm } from '../../components/family/CreateGroupForm';
import { FamilyGroupSummary } from '../../components/family/FamilyGroupSummary';
import { FamilyInvitations } from '../../components/family/FamilyInvitations';
import { FamilyManagement } from '../../components/family/FamilyManagement';
import { MemberDataView } from '../../components/family/MemberDataView';
import { MonthYearFilter } from '../../components/family/MonthYearFilter';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import { isAdmin } from '../../utils/familyGroupPermissions';
import type {
  Expense,
  Groups,
  Merchant,
  Payments,
  Revenue,
} from '../../services/resources';

const NewResources = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
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
    (totalCounts.store ?? 0) + (totalCounts.payment ?? 0) + (totalCounts.group ?? 0);

  const {
    isOpen: isSimpleOpen,
    onOpen: onSimpleOpen,
    onClose: onSimpleClose,
  } = useDisclosure();

  const [currentResource, setCurrentResource] = useState<
    'store' | 'payment' | 'group'
  >('store');

  const {
    familyGroup,
    summary,
    memberData,
    selectedMemberId,
    setSelectedMemberId,
    pendingCount,
    isLoadingGroup,
    isLoadingSummary,
    isLoadingMemberData,
    month,
    year,
    setMonth,
    setYear,
    loadGroup,
    loadSummary,
    loadPendingCount,
  } = useFamilyGroup();

  const currentUserId = profile?.user.id || '';
  const userIsAdmin = familyGroup ? isAdmin(familyGroup, currentUserId) : false;

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

  const handleModalSuccess = (
    resourceType: 'store' | 'payment' | 'group' | 'expense' | 'revenue',
  ) => {
    setEditingResource(null);
    triggerRefresh(resourceType);
  };

  const handleGroupCreated = () => {
    loadGroup();
  };

  const handleInvitationHandled = () => {
    loadGroup();
    loadPendingCount();
  };

  const handleRefresh = () => {
    loadGroup();
    loadSummary();
  };

  const tabSelectedStyle = {
    color: getColor('text.profile.selected'),
    bg: getColor('background.profile.secondary'),
  };

  const tabStyle = {
    color: getColor('text.familyGroup.primary'),
    fontFamily: getFont('body'),
    fontSize: 'sm',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  };

  if (isLoadingGroup) {
    return (
      <Flex direction="column" minH="100vh" bg={getColor('background.resources')}>
        <Header />
        <Flex flex={1} justify="center" align="center">
          <Spinner color={getColor('text.familyGroup.primary')} size="lg" />
        </Flex>
        <NavigationBar />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg={getColor('background.resources')} pb="70px">
      <Header />

      <Tabs variant="enclosed-colored">
        <TabList
          overflowX="auto"
          overflowY="hidden"
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
          flexWrap="nowrap"
        >
          <Tab _selected={tabSelectedStyle} {...tabStyle}>
            <Icon as={FiPackage} mr={1} />
            {t('navigationBar.resources')}
          </Tab>
          <Tab _selected={tabSelectedStyle} {...tabStyle}>
            <Icon as={FiUsers} mr={1} />
            {t('familyGroup.title')}
          </Tab>
          <Tab _selected={tabSelectedStyle} {...tabStyle}>
            <Icon as={FiMail} mr={1} />
            {t('familyGroup.invitations')}
            {pendingCount > 0 && (
              <Badge
                ml={1}
                bg={getColor('background.familyGroup.badge.notification')}
                color={getColor('text.familyGroup.badge.notification')}
                borderRadius="full"
                fontSize="xs"
              >
                {pendingCount}
              </Badge>
            )}
          </Tab>
          {familyGroup && userIsAdmin && (
            <Tab _selected={tabSelectedStyle} {...tabStyle}>
              <Icon as={FiSettings} mr={1} />
              {t('familyGroup.management')}
            </Tab>
          )}
        </TabList>

        <TabPanels>
          <TabPanel p={4}>
            <Accordion allowMultiple>
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
          </TabPanel>

          <TabPanel p={3}>
            {!familyGroup ? (
              <CreateGroupForm onGroupCreated={handleGroupCreated} />
            ) : (
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={getColor('text.familyGroup.title')}
                    fontFamily={getFont('heading')}
                  >
                    {summary?.groupName || familyGroup.name}
                  </Text>
                  <MonthYearFilter
                    month={month}
                    year={year}
                    onMonthChange={setMonth}
                    onYearChange={setYear}
                  />
                </Flex>

                <FamilyGroupSummary
                  summary={summary}
                  isLoading={isLoadingSummary}
                  selectedMemberId={selectedMemberId}
                  onSelectMember={setSelectedMemberId}
                />

                {selectedMemberId && (
                  <MemberDataView
                    data={memberData}
                    isLoading={isLoadingMemberData}
                  />
                )}
              </VStack>
            )}
          </TabPanel>

          <TabPanel p={0}>
            <FamilyInvitations onInvitationHandled={handleInvitationHandled} />
          </TabPanel>

          {familyGroup && userIsAdmin && (
            <TabPanel p={0}>
              <FamilyManagement group={familyGroup} onRefresh={handleRefresh} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

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
            editingResource?.type === currentResource && editingResource.data.id
              ? { id: editingResource.data.id, name: editingResource.data.name }
              : undefined
          }
        />
      )}

      <NavigationBar />
    </Flex>
  );
};

export default NewResources;
