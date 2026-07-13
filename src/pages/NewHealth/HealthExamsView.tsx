import { Box, Button, Icon } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageScaffold } from '../../components/PageScaffold';
import { PillTabBar, type PillTabItem } from '../../components/PillTabBar';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { HealthProcessingList } from './HealthProcessingList';
import { HealthRegisteredExamsList } from './HealthRegisteredExamsList';

type HealthExamsTab = 'registered' | 'processing';

export const HealthExamsView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: HealthExamsTab =
    searchParams.get('tab') === 'processing' ? 'processing' : 'registered';

  const tabs = useMemo<PillTabItem<HealthExamsTab>[]>(
    () => [
      { id: 'registered', label: t('health.exams.tabs.registered') },
      { id: 'processing', label: t('health.exams.tabs.processing') },
    ],
    [t],
  );

  const handleTabChange = (tab: HealthExamsTab) => {
    setSearchParams(tab === 'registered' ? {} : { tab });
  };

  return (
    <PageScaffold
      title={t('health.exams.title')}
      backTo="/new-resources/health"
      bg={getColor('background.resources')}
      contentLayout="plain"
      contentPx={0}
      contentPt={0}
      titleRight={
        <Button
          size="sm"
          bg={getColor('button.background.primary')}
          color={getColor('button.text.primary')}
          _hover={{ opacity: 0.9 }}
          leftIcon={<Icon as={FiPlus} />}
          onClick={() => navigate('/new-resources/health/register')}
        >
          {t('health.exams.new')}
        </Button>
      }
      headerExtra={
        <PillTabBar
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
          variant="health"
        />
      }
    >
      <Box px={4}>
        {activeTab === 'registered' ? (
          <HealthRegisteredExamsList />
        ) : (
          <HealthProcessingList />
        )}
      </Box>
    </PageScaffold>
  );
};
