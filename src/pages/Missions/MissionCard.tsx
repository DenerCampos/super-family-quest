import { useRef } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiStar } from 'react-icons/fi';
import { useMissionClaimReward } from '../../hooks/useMissionClaimReward';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { MissionWithProgressDto } from '../../types/mission';

interface MissionCardProps {
  item: MissionWithProgressDto;
}

export const MissionCard = ({ item }: MissionCardProps) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const claimMutation = useMissionClaimReward();
  const claimButtonRef = useRef<HTMLButtonElement>(null);

  const { mission, progress } = item;
  const progressPercent =
    mission.targetValue > 0
      ? Math.min((progress.currentValue / mission.targetValue) * 100, 100)
      : 0;

  const canClaim = progress.isCompleted && !progress.isClaimed && !!progress.id;

  const handleClaim = () => {
    if (!progress.id) return;

    const rect = claimButtonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;

    claimMutation.mutate({
      progressId: progress.id,
      rewardCoins: mission.rewardCoins,
      origin,
    });
  };

  return (
    <Box
      bg={getColor('background.missions.card')}
      borderColor={getColor('border.primary')}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      w="full"
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="flex-start" gap={2}>
          <Box flex={1}>
            <Text
              fontWeight="bold"
              fontSize="sm"
              color={getColor('text.profile.primary')}
            >
              {mission.title}
            </Text>
            <Badge
              mt={1}
              colorScheme={getColor('primary')}
              fontSize="2xs"
            >
              {t(`missions.frequency.${mission.frequency}`)}
            </Badge>
          </Box>
          <Badge
            colorScheme={getColor('accent')}
            display="flex"
            alignItems="center"
            gap={1}
            flexShrink={0}
          >
            <FiStar size={10} />
            {mission.rewardCoins}
          </Badge>
        </Flex>

        <Text fontSize="xs" color={getColor('text.profile.secondary')}>
          {mission.description}
        </Text>

        <Box>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="xs" color={getColor('text.profile.secondary')}>
              {t('missions.progress', {
                current: progress.currentValue,
                target: mission.targetValue,
              })}
            </Text>
            {progress.isCompleted && (
              <Text
                fontSize="xs"
                color={getColor('status.success')}
                fontWeight="bold"
              >
                {t('missions.completed')}
              </Text>
            )}
          </Flex>
          <Progress
            value={progressPercent}
            size="sm"
            borderRadius="full"
            colorScheme={
              progress.isCompleted ? getColor('revenue') : getColor('primary')
            }
          />
        </Box>

        {progress.isClaimed ? (
          <Button
            size="sm"
            isDisabled
            variant="outline"
            colorScheme={getColor('revenue')}
          >
            {t('missions.claimed')}
          </Button>
        ) : (
          <Button
            ref={claimButtonRef}
            size="sm"
            colorScheme={getColor('accent')}
            isDisabled={!canClaim}
            isLoading={claimMutation.isPending}
            onClick={handleClaim}
          >
            {t('missions.claim')}
          </Button>
        )}
      </VStack>
    </Box>
  );
};
