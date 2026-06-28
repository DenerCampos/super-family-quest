import {
  Box,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { PillTabBar, type PillTabItem } from '../../components/PillTabBar';
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

type FamilyTab = 'group' | 'invitations' | 'management';

export const FamilyGroupView = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<FamilyTab>('group');

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

  const tabs = useMemo(() => {
    const items: PillTabItem<FamilyTab>[] = [
      { id: 'group', label: t('familyGroup.title') },
      {
        id: 'invitations',
        label:
          pendingCount > 0
            ? `${t('familyGroup.invitations')} (${pendingCount})`
            : t('familyGroup.invitations'),
      },
    ];

    if (familyGroup && userIsAdmin) {
      items.push({ id: 'management', label: t('familyGroup.management') });
    }

    return items;
  }, [familyGroup, pendingCount, t, userIsAdmin]);

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

      <PillTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="family"
      />

      <Box flex={1} minH={0} overflow="auto" px={3} pb={20}>
        {activeTab === 'group' && (
          <Box pt={1}>
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
          </Box>
        )}

        {activeTab === 'invitations' && (
          <FamilyInvitations onInvitationHandled={handleInvitationHandled} />
        )}

        {activeTab === 'management' && familyGroup && userIsAdmin && (
          <FamilyManagement group={familyGroup} onRefresh={handleRefresh} />
        )}
      </Box>
    </FixedAppShell>
  );
};
