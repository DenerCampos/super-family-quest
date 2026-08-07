import { Text, VStack, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { ImageLightboxModal } from '../../components/financial-receipt/ImageLightboxModal';
import { usePendingApprovals } from '../../hooks/usePendingApprovals';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { toDisplayableImageUrl } from '../../utils/formatString';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';
import { PendingApprovalCard } from './PendingApprovalCard';
import { RejectOccurrenceModal } from './RejectOccurrenceModal';

export const ApprovalsView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const {
    hasGroup,
    isLoadingGroup,
    userIsAdminAnywhere,
    rows,
    isLoadingPending,
    approveMutation,
    rejectMutation,
    returnForAdjustmentMutation,
    rejectTarget,
    rejectReason,
    setRejectReason,
    openReject,
    closeReject,
    confirmReject,
  } = usePendingApprovals();

  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const openImagePreview = (url: string) => {
    setPreviewUrl(toDisplayableImageUrl(url) || url);
    onImageOpen();
  };

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.approvals.title')}
        isLoading
      />
    );
  }

  if (!hasGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.approvals.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  if (!userIsAdminAnywhere) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.approvals.title')}
        isLoading
      />
    );
  }

  return (
    <ChallengePageScaffold title={t('newChallenge.tiles.approvals.title')}>
      <VStack align="stretch" spacing={4} pb={8}>
        {isLoadingPending ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('common.loading')}
          </Text>
        ) : rows.length === 0 ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>
            {t('chores.emptyPending')}
          </Text>
        ) : (
          rows.map((item) => (
            <PendingApprovalCard
              key={`${item.familyGroupId}-${item.id}`}
              item={item}
              isApproving={
                approveMutation.isPending &&
                approveMutation.variables?.occurrenceId === item.id
              }
              isReturning={
                returnForAdjustmentMutation.isPending &&
                returnForAdjustmentMutation.variables?.occurrenceId === item.id
              }
              onApprove={() =>
                approveMutation.mutate({
                  familyGroupId: item.familyGroupId,
                  occurrenceId: item.id,
                })
              }
              onReturn={() =>
                returnForAdjustmentMutation.mutate({
                  familyGroupId: item.familyGroupId,
                  occurrenceId: item.id,
                })
              }
              onReject={() => openReject(item)}
              onPreviewImage={openImagePreview}
            />
          ))
        )}
      </VStack>

      <RejectOccurrenceModal
        isOpen={!!rejectTarget}
        reason={rejectReason}
        isSubmitting={rejectMutation.isPending}
        onReasonChange={setRejectReason}
        onClose={closeReject}
        onConfirm={confirmReject}
      />

      {previewUrl ? (
        <ImageLightboxModal
          url={previewUrl}
          isOpen={isImageOpen}
          onClose={() => {
            onImageClose();
            setPreviewUrl(null);
          }}
        />
      ) : null}
    </ChallengePageScaffold>
  );
};
