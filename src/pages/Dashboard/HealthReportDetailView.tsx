import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { PageScaffold } from '../../components/PageScaffold';
import { HealthMarkdownContent } from '../../components/health/HealthMarkdownContent';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useHealthOverviewById } from '../../hooks/useHealthOverview';
import { formatAppDateTime } from '../../utils/formatDate';

export const HealthReportDetailView = () => {
  const { overviewId } = useParams<{ overviewId: string }>();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const { data, isLoading, isError } = useHealthOverviewById(overviewId);

  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');

  return (
    <PageScaffold
      title={t('reports.healthReports.detailTitle')}
      backTo="/dashboard/healthReports"
      bg={getColor('background.dashboard.primary')}
      contentLayout="plain"
    >
      {isLoading && (
        <Flex justify="center" py={8}>
          <Spinner color={textPrimary} />
        </Flex>
      )}

      {isError && (
        <Text
          color={getColor('status.error')}
          textAlign="center"
          fontFamily={getFont('body')}
        >
          {t('reports.healthReports.error')}
        </Text>
      )}

      {!isLoading && !isError && data && (
        <Box
          bg={getColor('background.dashboard.filterBar')}
          border="1px solid"
          borderColor={getColor('border.dashboard.tile')}
          borderRadius="lg"
          p={4}
        >
          <Flex justify="space-between" align="center" mb={3} gap={3}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={textPrimary}
              fontFamily={getFont('body')}
              noOfLines={1}
            >
              {data.user?.name ?? t('reports.healthReports.unknownMember')}
            </Text>
            <Text fontSize="xs" color={textSub} fontFamily={getFont('body')}>
              {formatAppDateTime(data.generatedAt)}
            </Text>
          </Flex>

          <HealthMarkdownContent
            content={data.reportContent}
            textPrimary={textPrimary}
          />
        </Box>
      )}
    </PageScaffold>
  );
};
