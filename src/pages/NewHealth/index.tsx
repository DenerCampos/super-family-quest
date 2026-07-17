import { Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import {
  FiActivity,
  FiClipboard,
  FiFileText,
  FiHeart,
  FiSearch,
  FiTrendingUp,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { ReportTile } from '../../components/reports/ReportTile';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { NoFamilyGroupHint } from '../NewChallenge/NoFamilyGroupHint';

type Tile = {
  key: string;
  icon: typeof FiActivity;
  titleKey: string;
  subtitleKey: string;
  route: string;
};

const BASE_PATH = '/new-resources/health';

const baseTiles: Tile[] = [
  {
    key: 'feelingNow',
    icon: FiHeart,
    titleKey: 'health.tiles.feelingNow.title',
    subtitleKey: 'health.tiles.feelingNow.subtitle',
    route: `${BASE_PATH}/feeling-now`,
  },
  {
    key: 'exams',
    icon: FiClipboard,
    titleKey: 'health.tiles.exams.title',
    subtitleKey: 'health.tiles.exams.subtitle',
    route: `${BASE_PATH}/exams`,
  },
  {
    key: 'search',
    icon: FiSearch,
    titleKey: 'health.tiles.search.title',
    subtitleKey: 'health.tiles.search.subtitle',
    route: `${BASE_PATH}/search`,
  },
  {
    key: 'evolution',
    icon: FiTrendingUp,
    titleKey: 'health.tiles.evolution.title',
    subtitleKey: 'health.tiles.evolution.subtitle',
    route: `${BASE_PATH}/evolution`,
  },
  {
    key: 'overview',
    icon: FiActivity,
    titleKey: 'health.tiles.overview.title',
    subtitleKey: 'health.tiles.overview.subtitle',
    route: `${BASE_PATH}/overview`,
  },
  {
    key: 'prescriptions',
    icon: FiFileText,
    titleKey: 'health.tiles.prescriptions.title',
    subtitleKey: 'health.tiles.prescriptions.subtitle',
    route: `${BASE_PATH}/prescriptions`,
  },
];

const NewHealthHub = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });

  const tiles = baseTiles;

  if (isLoadingGroup) {
    return (
      <FixedAppShell bg={getColor('background.resources')}>
        <Flex flex={1} justify="center" align="center">
          <Spinner color={getColor('text.familyGroup.primary')} size="lg" />
        </Flex>
      </FixedAppShell>
    );
  }

  if (!familyGroup) {
    return (
      <FixedAppShell bg={getColor('background.resources')}>
        <Flex flex={1} align="center" justify="center" px={4} py={6} overflow="auto">
          <Box
            width="100%"
            maxW="600px"
            bg={getColor('background.familyGroup.card')}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={getColor('border.familyGroup.card')}
            p={6}
            boxShadow="sm"
          >
            <NoFamilyGroupHint />
          </Box>
        </Flex>
      </FixedAppShell>
    );
  }

  return (
    <FixedAppShell bg={getColor('background.resources')}>
      <PageTitleBar title={t('health.title')} backTo="/new-resources" />

      <Flex
        flex={1}
        minH={0}
        direction="column"
        align="center"
        justify="flex-start"
        pt={6}
        overflow="auto"
        px={4}
        pb={20}
      >
        <Box
          width="100%"
          maxW="600px"
          bg={getColor('background.familyGroup.card')}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={getColor('border.familyGroup.card')}
          p={{ base: 4, md: 5 }}
          boxShadow="sm"
        >
          <Text
            color={getColor('text.dashboard.tileSubtitle')}
            fontSize="sm"
            textAlign="center"
            mb={4}
          >
            {t('health.subtitle')}
          </Text>

          <Grid templateColumns="1fr 1fr" gap={3}>
            {tiles.map((tile) => (
              <ReportTile
                key={tile.key}
                icon={tile.icon}
                title={t(tile.titleKey)}
                subtitle={t(tile.subtitleKey)}
                isActive={false}
                onClick={() => navigate(tile.route)}
              />
            ))}
          </Grid>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};

export default NewHealthHub;
