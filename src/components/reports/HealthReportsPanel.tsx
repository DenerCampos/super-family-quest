import { Box, Flex, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useHealthOverviewList } from '../../hooks/useHealthOverview';
import { formatAppDateTime } from '../../utils/formatDate';

type Props = {
  startDate: string;
  endDate: string;
  userId?: string;
};

export function HealthReportsPanel({ startDate, endDate, userId }: Props) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useHealthOverviewList({
    targetUserId: userId,
    startDate,
    endDate,
  });

  const cardStyle = {
    borderRadius: 'lg',
    bg: getColor('background.dashboard.filterBar'),
    border: '1px solid',
    borderColor: getColor('border.dashboard.tile'),
  };

  return (
    <VStack align="stretch" spacing={3}>
      {isLoading && (
        <Flex justify="center" py={8}>
          <Spinner color={getColor('text.dashboard.title')} />
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
        <Box {...cardStyle} overflow="hidden">
          {data.length === 0 ? (
            <Text
              p={6}
              textAlign="center"
              color={getColor('text.dashboard.tileSubtitle')}
              fontFamily={getFont('body')}
            >
              {t('reports.healthReports.noData')}
            </Text>
          ) : (
            data.map((item, index) => (
              <Flex
                key={item.id}
                as="button"
                type="button"
                width="100%"
                align="center"
                justify="space-between"
                textAlign="left"
                p={4}
                gap={3}
                borderTop={index === 0 ? undefined : '1px solid'}
                borderColor={getColor('border.dashboard.tile')}
                _hover={{ bg: getColor('background.dashboard.tileActive') }}
                onClick={() => navigate(`/dashboard/health-report/${item.id}`)}
              >
                <Box flex={1} minW={0}>
                  <Text
                    fontWeight="semibold"
                    fontSize="sm"
                    color={getColor('text.dashboard.filterLabel')}
                    fontFamily={getFont('body')}
                    noOfLines={1}
                  >
                    {item.user?.name ?? t('reports.healthReports.unknownMember')}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={getColor('text.dashboard.tileSubtitle')}
                    fontFamily={getFont('body')}
                  >
                    {formatAppDateTime(item.generatedAt)}
                  </Text>
                </Box>
                <Icon
                  as={FiChevronRight}
                  color={getColor('text.dashboard.tileSubtitle')}
                />
              </Flex>
            ))
          )}
        </Box>
      )}
    </VStack>
  );
}
