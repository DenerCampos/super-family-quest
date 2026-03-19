import { useState, useEffect, useCallback } from 'react';
import {
  Accordion,
  Badge,
  Box,
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
import { FiPackage, FiUsers, FiMail, FiSettings } from 'react-icons/fi';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { SimpleResourceModal } from '../../components/modals/SimpleResourceModal';
import ExpenseResource from '../../components/resources/ExpenseResource';
import GroupResource from '../../components/resources/GroupResource';
import PaymentResource from '../../components/resources/PaymentResource';
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
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import { isAdmin } from '../../utils/familyGroupPermissions';
import type {
  FamilyGroupResponseDto,
  FamilyGroupSummaryDto,
  MemberDataDto,
} from '../../types/familyGroup';
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

  // --- Resources state ---
  const [editingResource, setEditingResource] = useState<{
    type: 'store' | 'payment' | 'group' | 'expense' | 'revenue';
    data: any;
  } | null>(null);

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

  // --- Family Group state ---
  const [familyGroup, setFamilyGroup] = useState<FamilyGroupResponseDto | null>(null);
  const [summary, setSummary] = useState<FamilyGroupSummaryDto | null>(null);
  const [memberData, setMemberData] = useState<MemberDataDto | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingMemberData, setIsLoadingMemberData] = useState(false);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const currentUserId = profile?.user.id || '';
  const userIsAdmin = familyGroup ? isAdmin(familyGroup, currentUserId) : false;

  const loadGroup = useCallback(async () => {
    setIsLoadingGroup(true);
    try {
      const groups = await api.familyGroupList();
      if (groups.length > 0) {
        setFamilyGroup(groups[0]);
      } else {
        setFamilyGroup(null);
      }
    } catch (error) {
      console.error(error);
      setFamilyGroup(null);
    } finally {
      setIsLoadingGroup(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    if (!familyGroup) return;
    setIsLoadingSummary(true);
    try {
      const data = await api.familyGroupGetSummary(familyGroup.id, month, year);
      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [familyGroup, month, year]);

  const loadMemberData = useCallback(
    async (memberId: string) => {
      if (!familyGroup) return;
      setIsLoadingMemberData(true);
      try {
        const data = await api.familyGroupGetMemberData(familyGroup.id, memberId, month, year);
        setMemberData(data);
      } catch (error) {
        console.error(error);
        setMemberData(null);
      } finally {
        setIsLoadingMemberData(false);
      }
    },
    [familyGroup, month, year],
  );

  const loadPendingCount = useCallback(async () => {
    try {
      const invitations = await api.familyGroupListInvitations();
      setPendingCount(invitations.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    loadGroup();
    loadPendingCount();
  }, [loadGroup, loadPendingCount]);

  useEffect(() => {
    if (familyGroup) {
      loadSummary();
    }
  }, [familyGroup, loadSummary]);

  useEffect(() => {
    if (selectedMemberId && familyGroup) {
      loadMemberData(selectedMemberId);
    } else {
      setMemberData(null);
    }
  }, [selectedMemberId, familyGroup, loadMemberData]);

  const handleSelectMember = (userId: string | null) => {
    setSelectedMemberId(userId);
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

  // --- Shared tab styles ---
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
              <Badge ml={1} colorScheme="red" borderRadius="full" fontSize="xs">
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
          {/* Tab Recursos */}
          <TabPanel p={4}>
            <Accordion allowMultiple>
              <ResourceContainer
                title="Cadastros"
                colorScheme={getColor('primary')}
              >
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

              <ResourceContainer title="Despesas" colorScheme={getColor('expense')}>
                <ExpenseResource
                  onDelete={(id) => handleDelete('expense', id)}
                  refreshTrigger={refreshTriggers.expense}
                />
              </ResourceContainer>

              <ResourceContainer title="Receitas" colorScheme={getColor('revenue')}>
                <RevenueResource
                  onDelete={(id) => handleDelete('revenue', id)}
                  refreshTrigger={refreshTriggers.revenue}
                />
              </ResourceContainer>
            </Accordion>
          </TabPanel>

          {/* Tab Grupo Familiar */}
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
                  onSelectMember={handleSelectMember}
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

          {/* Tab Convites */}
          <TabPanel p={0}>
            <FamilyInvitations onInvitationHandled={handleInvitationHandled} />
          </TabPanel>

          {/* Tab Gerenciamento (admin only) */}
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
            editingResource?.type === currentResource
              ? editingResource.data
              : null
          }
        />
      )}

      <NavigationBar />
    </Flex>
  );
};

export default NewResources;
