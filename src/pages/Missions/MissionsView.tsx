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
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
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
    <Flex direction="column" minH="100vh">
      <Header />

      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="flex-start"
        pt={6}
        pb={20}
        px={4}
        bg={getColor('background.resources')}
      >
        <Box width="100%" maxW="600px">
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
            mb={5}
          >
            {t('missions.subtitle')}
          </Text>

          {isLoading ? (
            <Flex justify="center" pt={8}>
              <Spinner color={getColor('text.dashboard.title')} />
            </Flex>
          ) : isError ? (
            <Text
              color={getColor('status.error')}
              fontSize="sm"
              textAlign="center"
              py={6}
            >
              {t('common.loadError')}
            </Text>
          ) : (
            <Tabs
              variant="soft-rounded"
              colorScheme={getColor('primary')}
              isFitted
            >
              <TabList
                bg={getColor('background.missions.tabList')}
                borderRadius="xl"
                p={1}
                mb={4}
              >
                {MISSION_TAB_KEYS.map((labelKey) => (
                  <Tab key={labelKey} {...tabStyle}>
                    {t(labelKey)}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {tabItems.map((items, index) => (
                  <TabPanel key={MISSION_TAB_KEYS[index]} px={0} pb={0}>
                    {renderList(items)}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Flex>

      <NavigationBar />
    </Flex>
  );
};
