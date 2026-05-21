import { Flex, Grid, Text, Box, Spinner, IconButton, Icon } from '@chakra-ui/react';
import {
  FiArrowLeft,
  FiCheckSquare,
  FiDollarSign,
  FiImage,
  FiList,
  FiShield,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { ReportTile } from '../../components/reports/ReportTile';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';

type Tile = {
  key: string;
  icon: typeof FiList;
  titleKey: string;
  subtitleKey: string;
  route: string;
};

const BASE_PATH = '/new-resources/quests';

const baseTiles: Tile[] = [
  {
    key: 'quests',
    icon: FiCheckSquare,
    titleKey: 'newChallenge.tiles.quests.title',
    subtitleKey: 'newChallenge.tiles.quests.subtitle',
    route: `${BASE_PATH}/chores`,
  },
  {
    key: 'definitions',
    icon: FiList,
    titleKey: 'newChallenge.tiles.definitions.title',
    subtitleKey: 'newChallenge.tiles.definitions.subtitle',
    route: `${BASE_PATH}/definitions`,
  },
  {
    key: 'allowance',
    icon: FiDollarSign,
    titleKey: 'newChallenge.tiles.allowance.title',
    subtitleKey: 'newChallenge.tiles.allowance.subtitle',
    route: `${BASE_PATH}/allowance`,
  },
  {
    key: 'history',
    icon: FiImage,
    titleKey: 'newChallenge.tiles.history.title',
    subtitleKey: 'newChallenge.tiles.history.subtitle',
    route: `${BASE_PATH}/history`,
  },
];

const adminTiles: Tile[] = [
  {
    key: 'approvals',
    icon: FiShield,
    titleKey: 'newChallenge.tiles.approvals.title',
    subtitleKey: 'newChallenge.tiles.approvals.subtitle',
    route: `${BASE_PATH}/approvals`,
  },
];

const NewChallengeHub = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });

  const userId = profile?.user.id ?? '';
  const userIsAdmin = familyGroup
    ? isAdmin(familyGroup, userId)
    : false;

  const tiles = [...baseTiles, ...(userIsAdmin ? adminTiles : [])];

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

  if (!familyGroup) {
    return (
      <Flex direction="column" minH="100vh">
        <Header />
        <Flex
          flex={1}
          bg={getColor('background.resources')}
          align="center"
          justify="center"
          px={4}
          py={6}
        >
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
        <NavigationBar />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Flex
        align="center"
        px={3}
        py={2}
        gap={1}
        bg={getColor('background.familyGroup.card')}
        borderBottomWidth="1px"
        borderColor={getColor('border.familyGroup.card')}
      >
        <IconButton
          aria-label={t('common.back')}
          icon={<Icon as={FiArrowLeft} boxSize={5} />}
          variant="ghost"
          size="md"
          flexShrink={0}
          onClick={() => navigate('/new-resources')}
          color={getColor('text.dashboard.title')}
          _hover={{ bg: getColor('background.familyGroup.memberCard') }}
        />
        <Text
          flex={1}
          fontWeight="bold"
          fontFamily={getFont('heading')}
          fontSize="md"
          color={getColor('text.dashboard.title')}
          noOfLines={1}
        >
          {t('newChallenge.title')}
        </Text>
      </Flex>

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
            {t('newChallenge.subtitle')}
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

      <NavigationBar />
    </Flex>
  );
};

export default NewChallengeHub;
