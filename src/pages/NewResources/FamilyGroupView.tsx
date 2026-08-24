import {
  Avatar,
  Box,
  Flex,
  Spinner,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
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
import { isOwner } from '../../utils/familyGroupPermissions';
import { toDisplayableImageUrl } from '../../utils/formatString';

type FamilyTab = 'group' | 'invitations' | 'management';

const FAMILY_TABS: FamilyTab[] = ['group', 'invitations', 'management'];

function resolveFamilyTab(tabParam: string | null): FamilyTab {
  if (tabParam && FAMILY_TABS.includes(tabParam as FamilyTab)) {
    return tabParam as FamilyTab;
  }
  return 'group';
}

export const FamilyGroupView = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<FamilyTab>(() =>
    resolveFamilyTab(searchParams.get('tab')),
  );

  useEffect(() => {
    setActiveTab(resolveFamilyTab(searchParams.get('tab')));
  }, [searchParams]);

  const {
    isOpen: isCreateOpen,
    onToggle: onToggleCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  const {
    familyGroups,
    familyGroup,
    familyStoryGroups,
    selectedFamilyGroupId,
    setSelectedFamilyGroupId,
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
    hasGroup,
    loadGroup,
    loadSummary,
    loadPendingCount,
  } = useFamilyGroup();

  const currentUserId = profile?.user.id || '';

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

    if (hasGroup) {
      items.push({ id: 'management', label: t('familyGroup.management') });
    }

    return items;
  }, [hasGroup, pendingCount, t]);

  const handleGroupCreated = () => {
    loadGroup();
    onCloseCreate();
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
            {!hasGroup ? (
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
                    {summary?.groupName || familyGroup?.name}
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
                  familyStoryGroups={familyStoryGroups}
                  selectedFamilyGroupId={selectedFamilyGroupId}
                  onSelectFamily={setSelectedFamilyGroupId}
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

        {activeTab === 'management' && hasGroup && (
          <VStack spacing={4} align="stretch" pt={2}>
            <Button
              leftIcon={<FiPlus />}
              size="sm"
              variant="outline"
              borderColor={getColor('border.familyGroup.card')}
              color={getColor('text.familyGroup.primary')}
              fontFamily={getFont('body')}
              onClick={onToggleCreate}
            >
              {t('familyGroup.createAnotherGroup')}
            </Button>

            <Collapse in={isCreateOpen} animateOpacity>
              <Box
                mb={2}
                borderWidth="1px"
                borderColor={getColor('border.familyGroup.card')}
                borderRadius="md"
                bg={getColor('background.familyGroup.card')}
              >
                <CreateGroupForm
                  mode="additional"
                  onGroupCreated={handleGroupCreated}
                />
              </Box>
            </Collapse>

            <Accordion allowMultiple defaultIndex={[0]}>
              {familyGroups.map((group) => {
                const owned = isOwner(group, currentUserId);
                return (
                  <AccordionItem
                    key={group.id}
                    border="1px solid"
                    borderColor={getColor('border.familyGroup.card')}
                    borderRadius="md"
                    mb={2}
                    bg={getColor('background.familyGroup.card')}
                  >
                    <AccordionButton
                      py={3}
                      _expanded={{ bg: getColor('background.familyGroup.memberCard') }}
                    >
                      <Avatar
                        size="sm"
                        mr={3}
                        name={group.name}
                        src={
                          toDisplayableImageUrl(group.groupImage) ||
                          group.coatOfArms
                        }
                        referrerPolicy="no-referrer"
                        bg={getColor('background.familyGroup.memberCard')}
                      />
                      <Box flex="1" textAlign="left">
                        <Text
                          fontWeight="bold"
                          fontFamily={getFont('heading')}
                          color={getColor('text.familyGroup.title')}
                        >
                          {owned
                            ? `${group.name} (${t('familyGroup.owner')})`
                            : group.name}
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={2} px={0}>
                      <FamilyManagement
                        group={group}
                        onRefresh={handleRefresh}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </VStack>
        )}
      </Box>
    </FixedAppShell>
  );
};
