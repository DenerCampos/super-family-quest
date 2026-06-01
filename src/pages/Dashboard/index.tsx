import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import {
  FiPieChart,
  FiTrendingUp,
  FiBarChart2,
  FiShoppingBag,
  FiPackage,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FixedAppShell } from '../../components/FixedAppShell';
import { ReportTile } from '../../components/reports/ReportTile';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { ReportKey } from '../../types/reports';

const tiles: { key: ReportKey; icon: typeof FiPieChart; titleKey: string; subtitleKey: string }[] = [
  {
    key: 'expensesByCategory',
    icon: FiPieChart,
    titleKey: 'dashboard.tiles.expensesByCategory.title',
    subtitleKey: 'dashboard.tiles.expensesByCategory.subtitle',
  },
  {
    key: 'expensesByDate',
    icon: FiTrendingUp,
    titleKey: 'dashboard.tiles.expensesByDate.title',
    subtitleKey: 'dashboard.tiles.expensesByDate.subtitle',
  },
  {
    key: 'expensesVsIncome',
    icon: FiBarChart2,
    titleKey: 'dashboard.tiles.expensesVsIncome.title',
    subtitleKey: 'dashboard.tiles.expensesVsIncome.subtitle',
  },
  {
    key: 'expensesByStore',
    icon: FiShoppingBag,
    titleKey: 'dashboard.tiles.expensesByStore.title',
    subtitleKey: 'dashboard.tiles.expensesByStore.subtitle',
  },
  {
    key: 'topProducts',
    icon: FiPackage,
    titleKey: 'dashboard.tiles.topProducts.title',
    subtitleKey: 'dashboard.tiles.topProducts.subtitle',
  },
];

const Dashboard = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  return (
    <FixedAppShell bg={getColor('background.dashboard.primary')}>
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
        <Box width="100%" maxW="600px">
          <Text
            fontSize="xl"
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.dashboard.title')}
            mb={4}
            textAlign="center"
          >
            {t('dashboard.title')}
          </Text>

          <Text
            color={getColor('text.dashboard.tileSubtitle')}
            fontSize="sm"
            textAlign="center"
            mb={4}
          >
            {t('dashboard.selectReport')}
          </Text>

          <Grid templateColumns="1fr 1fr" gap={3}>
            {tiles.map((tile) => (
              <ReportTile
                key={tile.key}
                icon={tile.icon}
                title={t(tile.titleKey)}
                subtitle={t(tile.subtitleKey)}
                isActive={false}
                onClick={() => navigate(`/dashboard/${tile.key}`)}
              />
            ))}
          </Grid>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};

export default Dashboard;
