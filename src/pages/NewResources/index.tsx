import { Flex, Grid, Text, Box } from '@chakra-ui/react';
import { FiPackage, FiUsers, FiShoppingCart, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { ReportTile } from '../../components/reports/ReportTile';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type TileKey = 'resources' | 'familyGroup' | 'shoppingList' | 'settings';

const tiles: {
  key: TileKey;
  icon: typeof FiPackage;
  titleKey: string;
  subtitleKey: string;
  route: string;
}[] = [
  {
    key: 'resources',
    icon: FiPackage,
    titleKey: 'newResources.tiles.resources.title',
    subtitleKey: 'newResources.tiles.resources.subtitle',
    route: '/new-resources/resources',
  },
  {
    key: 'familyGroup',
    icon: FiUsers,
    titleKey: 'newResources.tiles.familyGroup.title',
    subtitleKey: 'newResources.tiles.familyGroup.subtitle',
    route: '/new-resources/family',
  },
  {
    key: 'shoppingList',
    icon: FiShoppingCart,
    titleKey: 'newResources.tiles.shoppingList.title',
    subtitleKey: 'newResources.tiles.shoppingList.subtitle',
    route: '/new-resources/shopping',
  },
  {
    key: 'settings',
    icon: FiSettings,
    titleKey: 'settings.title',
    subtitleKey: 'settings.subtitle',
    route: '/settings',
  },
];

const NewResources = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

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
            mb={4}
            textAlign="center"
          >
            {t('newResources.title')}
          </Text>

          <Text
            color={getColor('text.dashboard.tileSubtitle')}
            fontSize="sm"
            textAlign="center"
            mb={4}
          >
            {t('newResources.subtitle')}
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

export default NewResources;
