import {
  Box,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import type React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { toDisplayableImageUrl } from '../../utils/formatString';
import type { ChoreOccurrenceResponseDto } from '../../types/chore';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { QuestOccurrenceDetailPhotoUploadBlock } from './QuestOccurrenceDetailPhotoUploadBlock';

export type QuestOccurrenceDetailContentProps = {
  occ: ChoreOccurrenceResponseDto;
  getColor: (path: string) => string;
  getFont: (type: 'body' | 'heading' | 'mono' | 'theme') => string;
  t: (key: string, options?: Record<string, unknown>) => string;
  beforeCameraRef: React.RefObject<HTMLInputElement | null>;
  beforeGalleryRef: React.RefObject<HTMLInputElement | null>;
  afterCameraRef: React.RefObject<HTMLInputElement | null>;
  afterGalleryRef: React.RefObject<HTMLInputElement | null>;
  fileBefore: File | null;
  fileAfter: File | null;
  onPickBefore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPickAfter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadBefore: () => void;
  handleUploadAfter: () => void;
  uploadIsPending: boolean;
  submitIsPending: boolean;
  onSubmitForApproval: () => void;
  canActInProgress: boolean;
  photosReadyForSubmit: boolean;
};

export const QuestOccurrenceDetailContent = ({
  occ,
  getColor,
  getFont,
  t,
  beforeCameraRef,
  beforeGalleryRef,
  afterCameraRef,
  afterGalleryRef,
  fileBefore,
  fileAfter,
  onPickBefore,
  onPickAfter,
  handleUploadBefore,
  handleUploadAfter,
  uploadIsPending,
  submitIsPending,
  onSubmitForApproval,
  canActInProgress,
  photosReadyForSubmit,
}: QuestOccurrenceDetailContentProps) => {
  const reward = occ.snapshotRewardMoney ?? occ.definition.rewardValue;
  const coins = occ.snapshotCoinReward ?? occ.definition.coinReward;

  return (
    <ChallengePageScaffold
      title={occ.definition.title}
      backTo="/new-challenge/quests"
    >
      <VStack align="stretch" spacing={4} pb={8}>
        <Box
          p={3}
          borderRadius="md"
          borderWidth="1px"
          borderColor={getColor('border.familyGroup.card')}
          bg={getColor('background.familyGroup.memberCard')}
        >
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between" align="flex-start" spacing={3}>
              <Text
                fontSize="sm"
                color={getColor('text.familyGroup.secondary')}
                flexShrink={0}
              >
                {t('chores.detailMesadaValue')}
              </Text>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={getColor('text.coin')}
                fontFamily={getFont('body')}
                textAlign="right"
              >
                {formatCurrency(reward)}
              </Text>
            </HStack>
            <HStack justify="space-between" align="center" spacing={3}>
              <Text
                fontSize="sm"
                color={getColor('text.familyGroup.secondary')}
              >
                {t('chores.detailCoinsReward')}
              </Text>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={getColor('text.coin')}
                fontFamily={getFont('body')}
              >
                {coins}
              </Text>
            </HStack>
            <HStack justify="space-between" align="flex-start" spacing={3}>
              <Text
                fontSize="sm"
                color={getColor('text.familyGroup.secondary')}
                flexShrink={0}
              >
                {t('chores.startedByQuest')}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={getColor('text.familyGroup.title')}
                textAlign="right"
                noOfLines={3}
              >
                {occ.assignedTo?.name ?? t('chores.notStartedYet')}
              </Text>
            </HStack>
          </VStack>
        </Box>
        {occ.definition.description ? (
          <Text color={getColor('text.familyGroup.primary')} fontSize="sm">
            {occ.definition.description}
          </Text>
        ) : null}
        <Text fontSize="sm" color={getColor('text.familyGroup.secondary')}>
          {t('chores.statusLabel')}: {t(`chores.status.${occ.status}`)}
        </Text>

        {occ.rejectionReason ? (
          <Box
            p={3}
            borderRadius="md"
            bg={getColor('background.familyGroup.memberCard')}
            borderLeftWidth="4px"
            borderLeftColor={getColor('status.error')}
          >
            <Text
              fontWeight="bold"
              mb={1}
              color={getColor('text.familyGroup.title')}
            >
              {t('chores.rejectionReason')}
            </Text>
            <Text
              fontSize="sm"
              color={getColor('text.familyGroup.primary')}
            >
              {occ.rejectionReason}
            </Text>
          </Box>
        ) : null}

        {(occ.photoBeforeUrl || occ.photoAfterUrl) && (
          <VStack align="stretch" spacing={2}>
            {occ.photoBeforeUrl ? (
              <Box>
                <Text
                  fontSize="sm"
                  mb={1}
                  color={getColor('text.familyGroup.primary')}
                >
                  {t('chores.photoBefore')}
                </Text>
                <Image
                  src={
                    toDisplayableImageUrl(occ.photoBeforeUrl) ||
                    occ.photoBeforeUrl
                  }
                  alt=""
                  maxH="120px"
                  borderRadius="md"
                />
              </Box>
            ) : null}
            {occ.photoAfterUrl ? (
              <Box>
                <Text
                  fontSize="sm"
                  mb={1}
                  color={getColor('text.familyGroup.primary')}
                >
                  {t('chores.photoAfter')}
                </Text>
                <Image
                  src={
                    toDisplayableImageUrl(occ.photoAfterUrl) ||
                    occ.photoAfterUrl
                  }
                  alt=""
                  maxH="120px"
                  borderRadius="md"
                />
              </Box>
            ) : null}
          </VStack>
        )}

        <QuestOccurrenceDetailPhotoUploadBlock
          occ={occ}
          getColor={getColor}
          t={t}
          beforeCameraRef={beforeCameraRef}
          beforeGalleryRef={beforeGalleryRef}
          afterCameraRef={afterCameraRef}
          afterGalleryRef={afterGalleryRef}
          fileBefore={fileBefore}
          fileAfter={fileAfter}
          onPickBefore={onPickBefore}
          onPickAfter={onPickAfter}
          handleUploadBefore={handleUploadBefore}
          handleUploadAfter={handleUploadAfter}
          uploadIsPending={uploadIsPending}
          submitIsPending={submitIsPending}
          onSubmitForApproval={onSubmitForApproval}
          canActInProgress={canActInProgress}
          photosReadyForSubmit={photosReadyForSubmit}
        />
      </VStack>
    </ChallengePageScaffold>
  );
};
