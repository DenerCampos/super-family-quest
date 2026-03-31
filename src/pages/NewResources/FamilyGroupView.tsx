import {
  Badge,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiArrowLeft, FiUsers, FiMail, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
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
import { isAdmin } from '../../utils/familyGroupPermissions';

export const FamilyGroupView = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

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
  const userIsAdmin = familyGroup
    ? isAdmin(familyGroup, currentUserId)
    : false;

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
      <Flex
        direction="column"
        minH="100vh"
        bg={getColor('background.resources')}
      >
        <Header />
        <Flex flex={1} justify="center" align="center">
          <Spinner color={getColor('text.familyGroup.primary')} size="lg" />
        </Flex>
        <NavigationBar />
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={getColor('background.resources')}
      pb="70px"
    >
      <Header />

      <Flex align="center" px={4} pt={4} pb={2} gap={3}>
        <IconButton
          aria-label={t('common.back')}
          icon={<FiArrowLeft />}
          variant="ghost"
          color={getColor('text.dashboard.title')}
          onClick={() => navigate('/new-resources')}
          size="sm"
        />
        <Text
          fontSize="lg"
          fontWeight="bold"
          fontFamily={getFont('heading')}
          color={getColor('text.dashboard.title')}
        >
          {t('newResources.tiles.familyGroup.title')}
        </Text>
      </Flex>

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
          <TabPanel p={3}>
            {!familyGroup ? (
              <CreateGroupForm
                onGroupCreated={handleGroupCreated}
                defaultGroupName={profile?.user.family}
              />
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
            <FamilyInvitations
              onInvitationHandled={handleInvitationHandled}
            />
          </TabPanel>

          {familyGroup && userIsAdmin && (
            <TabPanel p={0}>
              <FamilyManagement
                group={familyGroup}
                onRefresh={handleRefresh}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

      <NavigationBar />
    </Flex>
  );
};
