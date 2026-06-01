import {
  Box,
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FixedAppShell } from '../../components/FixedAppShell';
import { useMissions } from '../../hooks/useMissions';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { MissionWithProgressDto } from '../../types/mission';
import { MissionCard } from './MissionCard';

const MISSION_TAB_KEYS = [
  'missions.tabs.daily',
  'missions.tabs.monthly',
  'missions.tabs.unique',
] as const;

export const MissionsView = () => {
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();
  const { daily, monthly, once, isLoading, isError } = useMissions();

  const tabItems: MissionWithProgressDto[][] = [daily, monthly, once];

  const tabStyle = {
    fontSize: 'xs' as const,
    fontWeight: 'bold' as const,
    _selected: {
      bg: getColor('background.profile.primary'),
      color: getColor('text.profile.primary'),
    },
    color: getColor('text.profile.secondary'),
  };

  const renderList = (items: MissionWithProgressDto[]) => {
    if (items.length === 0) {
      return (
        <Text
          color={getColor('text.profile.secondary')}
          fontSize="sm"
          textAlign="center"
          py={6}
        >
          {t('missions.empty')}
        </Text>
      );
    }

    return (
      <VStack spacing={3} align="stretch">
        {items.map((item) => (
          <MissionCard key={item.mission.id} item={item} />
        ))}
      </VStack>
    );
  };

  return (
    <FixedAppShell bg={getColor('background.resources')}>
      <Box flexShrink={0} px={4} pt={6} maxW="600px" mx="auto" w="full">
        <Text
          fontSize="xl"
          fontWeight="bold"
          fontFamily={getFont('heading')}
          color={getColor('text.dashboard.title')}
          mb={2}
          textAlign="center"
        >
          {t('missions.title')}
        </Text>

        <Text
          color={getColor('text.dashboard.tileSubtitle')}
          fontSize="sm"
          textAlign="center"
          mb={4}
        >
          {t('missions.subtitle')}
        </Text>
      </Box>

      {isLoading ? (
        <Flex flex={1} justify="center" align="center">
          <Spinner color={getColor('text.dashboard.title')} />
        </Flex>
      ) : isError ? (
        <Flex flex={1} justify="center" align="center" px={4}>
          <Text color={getColor('status.error')} fontSize="sm" textAlign="center">
            {t('common.loadError')}
          </Text>
        </Flex>
      ) : (
        <Tabs
          display="flex"
          flexDirection="column"
          flex={1}
          minH={0}
          overflow="hidden"
          variant="soft-rounded"
          colorScheme={getColor('primary')}
          isFitted
          px={4}
        >
          <TabList
            flexShrink={0}
            bg={getColor('background.missions.tabList')}
            borderRadius="xl"
            p={1}
            mb={2}
            maxW="600px"
            mx="auto"
            w="full"
          >
            {MISSION_TAB_KEYS.map((labelKey) => (
              <Tab key={labelKey} {...tabStyle}>
                {t(labelKey)}
              </Tab>
            ))}
          </TabList>

          <TabPanels flex={1} minH={0} overflow="hidden">
            {tabItems.map((items, index) => (
              <TabPanel
                key={MISSION_TAB_KEYS[index]}
                px={0}
                pt={0}
                pb={20}
                h="100%"
                overflow="auto"
                maxW="600px"
                mx="auto"
                w="full"
              >
                {renderList(items)}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </FixedAppShell>
  );
};
