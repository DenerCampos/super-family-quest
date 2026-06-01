import {
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
} from '@chakra-ui/react';
import { FiUsers, FiMail, FiSettings } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
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
      <FixedAppShell bg={getColor('background.resources')}>
        <PageTitleBar
          title={t('newResources.tiles.familyGroup.title')}
          backTo="/new-resources"
        />
        <Flex flex={1} justify="center" align="center">
          <Spinner color={getColor('text.familyGroup.primary')} size="lg" />
        </Flex>
      </FixedAppShell>
    );
  }

  return (
    <FixedAppShell bg={getColor('background.resources')}>
      <PageTitleBar
        title={t('newResources.tiles.familyGroup.title')}
        backTo="/new-resources"
      />

      <Tabs
        variant="enclosed-colored"
        display="flex"
        flexDirection="column"
        flex={1}
        minH={0}
        overflow="hidden"
      >
        <TabList
          flexShrink={0}
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

        <TabPanels flex={1} minH={0} overflow="hidden">
          <TabPanel p={3} h="100%" overflow="auto" pb={20}>
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

          <TabPanel p={0} h="100%" overflow="auto" pb={20}>
            <FamilyInvitations
              onInvitationHandled={handleInvitationHandled}
            />
          </TabPanel>

          {familyGroup && userIsAdmin && (
            <TabPanel p={0} h="100%" overflow="auto" pb={20}>
              <FamilyManagement
                group={familyGroup}
                onRefresh={handleRefresh}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </FixedAppShell>
  );
};
