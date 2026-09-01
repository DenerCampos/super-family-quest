import { useEffect, useRef } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiLoader, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import {
  useDiscardProcessing,
  useHealthProcessing,
  useRetryProcessing,
} from '../../hooks/useHealthExams';
import type { HealthProcessingStatus } from '../../types/health';
import { getProcessingStatusColor } from '../../utils/healthConstants';
import { formatAutoRetryRemaining } from '../../utils/healthProcessingRetry';
import { emitAiProviderError } from '../../utils/aiProviderError';

const statusIcon: Record<HealthProcessingStatus, typeof FiClock> = {
  QUEUED: FiClock,
  PROCESSING: FiLoader,
  COMPLETED: FiCheckCircle,
  FAILED: FiAlertCircle,
};

export const HealthProcessingList = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { data: items, isLoading } = useHealthProcessing();
  const discardMutation = useDiscardProcessing();
  const retryMutation = useRetryProcessing();
  const seenStatuses = useRef(new Map<string, HealthProcessingStatus>());

  useEffect(() => {
    if (!items) return;
    for (const item of items) {
      const previous = seenStatuses.current.get(item.id);
      seenStatuses.current.set(item.id, item.status);
      if (previous && previous !== 'FAILED' && item.status === 'FAILED') {
        emitAiProviderError();
      }
    }
  }, [items]);

  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const successColor = getColor('status.success');
  const dangerColor = getColor('status.error');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');

  const handleRemoveFailed = async (
    event: React.MouseEvent,
    id: string,
  ) => {
    event.stopPropagation();
    await discardMutation.mutateAsync(id);
  };

  const handleRetryFailed = async (
    event: React.MouseEvent,
    id: string,
  ) => {
    event.stopPropagation();
    await retryMutation.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner color={getColor('text.familyGroup.primary')} />
      </Flex>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        p={6}
        textAlign="center"
      >
        <Text color={textSub} fontSize="sm">
          {t('health.pending.empty')}
        </Text>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {items.map((item) => {
        const statusColor = getProcessingStatusColor(item.status, getColor);
        const isReviewable = item.status === 'COMPLETED';

        return (
          <Box
            key={item.id}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={4}
            cursor={isReviewable ? 'pointer' : 'default'}
            _hover={
              isReviewable
                ? { borderColor: getColor('text.familyGroup.primary') }
                : {}
            }
            onClick={() => {
              if (isReviewable) {
                navigate(`/new-resources/health/pending/${item.id}`);
              }
            }}
          >
            <Flex direction="column" gap={2}>
              <Flex justify="space-between" align="flex-start" gap={2}>
                <Flex gap={2} align="flex-start" flex={1} minW={0}>
                  <Icon as={statusIcon[item.status]} color={statusColor} mt={0.5} flexShrink={0} />
                  <Text
                    color={textPrimary}
                    fontSize="sm"
                    fontWeight="semibold"
                    noOfLines={2}
                    flex={1}
                    minW={0}
                  >
                    {item.originalFilename ?? t('health.pending.unknownFile')}
                  </Text>
                </Flex>
                <Badge
                  bg={statusColor}
                  color={textPrimary}
                  size="sm"
                  flexShrink={0}
                  whiteSpace="nowrap"
                >
                  {t(`health.pending.status.${item.status}`)}
                </Badge>
              </Flex>

              <Text color={textSub} fontSize="xs" noOfLines={1}>
                {t('health.pending.for')}: {item.targetUser?.name}
              </Text>
            </Flex>

            {(item.status === 'QUEUED' || item.status === 'PROCESSING') && (
              <Text color={textSub} fontSize="xs" mt={2}>
                {t('health.pending.waitingProcessingHint')}
              </Text>
            )}

            {item.status === 'FAILED' && (
              <Flex direction="column" gap={2} mt={2} align="flex-start">
                <Text color={statusColor} fontSize="xs">
                  {formatAutoRetryRemaining(item.failedAt, t)}
                </Text>
                <Flex gap={2} wrap="wrap">
                  <Button
                    size="xs"
                    bg={primaryBtnBg}
                    color={primaryBtnText}
                    _hover={{ opacity: 0.9 }}
                    leftIcon={<Icon as={FiRefreshCw} />}
                    isLoading={
                      retryMutation.isPending &&
                      retryMutation.variables === item.id
                    }
                    onClick={(event) => void handleRetryFailed(event, item.id)}
                  >
                    {t('health.pending.retryFailed')}
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={dangerColor}
                    color={dangerColor}
                    leftIcon={<Icon as={FiTrash2} />}
                    isLoading={
                      discardMutation.isPending &&
                      discardMutation.variables === item.id
                    }
                    onClick={(event) => void handleRemoveFailed(event, item.id)}
                  >
                    {t('health.pending.removeFailed')}
                  </Button>
                </Flex>
              </Flex>
            )}

            {item.status === 'COMPLETED' && (
              <Text color={successColor} fontSize="xs" mt={2}>
                {t('health.pending.clickToReview')}
              </Text>
            )}
          </Box>
        );
      })}
    </Stack>
  );
};
