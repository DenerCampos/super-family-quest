import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { FamilyGroupBadge } from '../../components/family/FamilyGroupBadge';
import type { TaggedPendingApproval } from '../../hooks/usePendingApprovals';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { formatCurrency } from '../../utils/formatCurrency';
import { toDisplayableImageUrl } from '../../utils/formatString';

type PendingApprovalCardProps = {
  item: TaggedPendingApproval;
  isApproving: boolean;
  isReturning: boolean;
  onApprove: () => void;
  onReturn: () => void;
  onReject: () => void;
  onPreviewImage: (url: string) => void;
};

export function PendingApprovalCard({
  item,
  isApproving,
  isReturning,
  onApprove,
  onReturn,
  onReject,
  onPreviewImage,
}: PendingApprovalCardProps) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const reward = item.snapshotRewardMoney ?? item.definition.rewardValue;

  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={getColor('border.familyGroup.card')}
      bg={getColor('background.familyGroup.card')}
    >
      <Box mb={2}>
        <FamilyGroupBadge name={item.familyGroupName} />
      </Box>
      <Text
        fontWeight="bold"
        fontFamily={getFont('body')}
        color={getColor('text.familyGroup.title')}
        mb={1}
      >
        {item.definition.title}
      </Text>
      {item.assignedTo ? (
        <Text
          fontSize="sm"
          color={getColor('text.dashboard.tileSubtitle')}
          mb={2}
        >
          {t('chores.assignee')}: {item.assignedTo.name}
        </Text>
      ) : null}
      <Text fontWeight="bold" color={getColor('text.coin')} mb={3}>
        {formatCurrency(reward)}
      </Text>
      <VStack align="stretch" spacing={3} mb={3}>
        {!item.photoBeforeUrl && !item.photoAfterUrl ? (
          <Text fontSize="sm" color={getColor('text.dashboard.tileSubtitle')}>
            {t('chores.noApprovalPhotos')}
          </Text>
        ) : null}
        {item.photoBeforeUrl ? (
          <Box>
            <Text
              fontSize="sm"
              fontWeight="bold"
              mb={1}
              color={getColor('text.familyGroup.primary')}
            >
              {t('chores.photoBefore')}
            </Text>
            <Image
              src={
                toDisplayableImageUrl(item.photoBeforeUrl) ||
                item.photoBeforeUrl
              }
              alt=""
              maxH="200px"
              w="100%"
              objectFit="contain"
              borderRadius="md"
              cursor="pointer"
              onClick={() => onPreviewImage(item.photoBeforeUrl as string)}
            />
          </Box>
        ) : null}
        {item.photoAfterUrl ? (
          <Box>
            <Text
              fontSize="sm"
              fontWeight="bold"
              mb={1}
              color={getColor('text.familyGroup.primary')}
            >
              {t('chores.photoAfter')}
            </Text>
            <Image
              src={
                toDisplayableImageUrl(item.photoAfterUrl) || item.photoAfterUrl
              }
              alt=""
              maxH="200px"
              w="100%"
              objectFit="contain"
              borderRadius="md"
              cursor="pointer"
              onClick={() => onPreviewImage(item.photoAfterUrl as string)}
            />
          </Box>
        ) : null}
      </VStack>
      <Flex mt={3} gap={2} flexWrap="wrap">
        <Button
          size="sm"
          bg={getColor('button.background.revenue')}
          color={getColor('button.text.revenue')}
          onClick={onApprove}
          isLoading={isApproving}
        >
          {t('chores.approve')}
        </Button>
        <Button
          size="sm"
          bg={getColor('status.warning')}
          color={getColor('button.text.revenue')}
          onClick={onReturn}
          isLoading={isReturning}
        >
          {t('chores.returnForAdjustment')}
        </Button>
        <Button
          size="sm"
          bg={getColor('status.error')}
          color={getColor('button.text.revenue')}
          onClick={onReject}
        >
          {t('chores.reject')}
        </Button>
      </Flex>
    </Box>
  );
}
