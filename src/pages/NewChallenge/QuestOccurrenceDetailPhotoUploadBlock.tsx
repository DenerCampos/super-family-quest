import {
  Box,
  Button,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import type React from 'react';
import { CHORE_PHOTO_ACCEPT_ATTR } from '../../utils/chore-occurrence-photo-constants';
import type { ChoreOccurrenceResponseDto } from '../../types/chore';

export type QuestOccurrenceDetailPhotoUploadBlockProps = {
  occ: ChoreOccurrenceResponseDto;
  getColor: (path: string) => string;
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

export const QuestOccurrenceDetailPhotoUploadBlock = ({
  occ,
  getColor,
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
}: QuestOccurrenceDetailPhotoUploadBlockProps) => {
  const hasBeforeOnServer = !!occ.photoBeforeUrl;
  const canUseAfterSection = hasBeforeOnServer;

  return (
    <>
      {canActInProgress ? (
        <VStack align="stretch" spacing={3}>
          <Text
            fontWeight="bold"
            color={getColor('text.familyGroup.title')}
          >
            {t('chores.uploadPhotosSection')}
          </Text>
          <Box>
            <FormLabel
              fontSize="sm"
              color={getColor('text.familyGroup.title')}
            >
              {t('chores.photoBeforeInput')}
            </FormLabel>
            <Input
              ref={beforeCameraRef as React.LegacyRef<HTMLInputElement>}
              type="file"
              accept={CHORE_PHOTO_ACCEPT_ATTR}
              capture="environment"
              onChange={onPickBefore}
              display="none"
              aria-hidden
              tabIndex={-1}
            />
            <Input
              ref={beforeGalleryRef as React.LegacyRef<HTMLInputElement>}
              type="file"
              accept={CHORE_PHOTO_ACCEPT_ATTR}
              onChange={onPickBefore}
              display="none"
              aria-hidden
              tabIndex={-1}
            />
            <HStack spacing={2} flexWrap="wrap">
              <Button
                size="sm"
                variant="outline"
                borderColor={getColor('border.primary')}
                color={getColor('text.familyGroup.title')}
                onClick={() => {
                  beforeCameraRef.current?.click();
                }}
              >
                {t('chores.takePhoto')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor={getColor('border.primary')}
                color={getColor('text.familyGroup.title')}
                onClick={() => beforeGalleryRef.current?.click()}
              >
                {t('chores.chooseImageFromDevice')}
              </Button>
            </HStack>
            {fileBefore ? (
              <Text
                fontSize="xs"
                mt={1}
                color={getColor('text.dashboard.tileSubtitle')}
              >
                {fileBefore.name}
              </Text>
            ) : null}
            <Button
              mt={2}
              w="full"
              bg={getColor('button.background.revenue')}
              color={getColor('button.text.revenue')}
              onClick={handleUploadBefore}
              isLoading={uploadIsPending}
              isDisabled={uploadIsPending || !fileBefore}
            >
              {t('chores.sendBeforePhoto')}
            </Button>
          </Box>
          <Box opacity={canUseAfterSection ? 1 : 0.6}>
            <FormLabel
              fontSize="sm"
              color={getColor('text.familyGroup.title')}
            >
              {t('chores.photoAfterInput')}
            </FormLabel>
            {!canUseAfterSection ? (
              <Text fontSize="xs" mb={2} color={getColor('status.warning')}>
                {t('chores.needBeforePhotoHint')}
              </Text>
            ) : null}
            <Input
              ref={afterCameraRef as React.LegacyRef<HTMLInputElement>}
              type="file"
              accept={CHORE_PHOTO_ACCEPT_ATTR}
              capture="environment"
              onChange={onPickAfter}
              display="none"
              aria-hidden
              tabIndex={-1}
            />
            <Input
              ref={afterGalleryRef as React.LegacyRef<HTMLInputElement>}
              type="file"
              accept={CHORE_PHOTO_ACCEPT_ATTR}
              onChange={onPickAfter}
              display="none"
              aria-hidden
              tabIndex={-1}
            />
            <HStack spacing={2} flexWrap="wrap">
              <Button
                size="sm"
                variant="outline"
                borderColor={getColor('border.primary')}
                color={getColor('text.familyGroup.title')}
                onClick={() => afterCameraRef.current?.click()}
                isDisabled={!canUseAfterSection}
              >
                {t('chores.takePhoto')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor={getColor('border.primary')}
                color={getColor('text.familyGroup.title')}
                onClick={() => afterGalleryRef.current?.click()}
                isDisabled={!canUseAfterSection}
              >
                {t('chores.chooseImageFromDevice')}
              </Button>
            </HStack>
            {fileAfter ? (
              <Text
                fontSize="xs"
                mt={1}
                color={getColor('text.dashboard.tileSubtitle')}
              >
                {fileAfter.name}
              </Text>
            ) : null}
            <Button
              mt={2}
              w="full"
              bg={getColor('button.background.revenue')}
              color={getColor('button.text.revenue')}
              onClick={handleUploadAfter}
              isLoading={uploadIsPending}
              isDisabled={
                uploadIsPending || !canUseAfterSection || !fileAfter
              }
            >
              {t('chores.sendAfterPhoto')}
            </Button>
          </Box>
          <Button
            bg={getColor('button.background.primary')}
            color={getColor('button.text.primary')}
            onClick={onSubmitForApproval}
            isLoading={submitIsPending}
            isDisabled={
              submitIsPending ||
              !photosReadyForSubmit ||
              occ.status !== 'IN_PROGRESS'
            }
          >
            {t('chores.submitForApproval')}
          </Button>
        </VStack>
      ) : null}

      {!canActInProgress && occ.status === 'IN_PROGRESS' ? (
        <Text
          fontSize="sm"
          color={getColor('text.dashboard.tileSubtitle')}
        >
          {t('chores.notAssignee')}
        </Text>
      ) : null}
    </>
  );
};
