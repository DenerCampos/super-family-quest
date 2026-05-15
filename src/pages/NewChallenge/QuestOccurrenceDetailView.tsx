import { Button, Text } from '@chakra-ui/react';
import { useQuestOccurrenceDetail } from '../../hooks/useQuestOccurrenceDetail';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';
import { QuestOccurrenceDetailContent } from './QuestOccurrenceDetailContent';

export const QuestOccurrenceDetailView = () => {
  const { getColor, getFont } = useVisualTheme();
  const {
    initialOccurrence,
    navigate,
    detailQuery,
    occ,
    familyGroup,
    isLoadingGroup,
    beforeCameraRef,
    beforeGalleryRef,
    afterCameraRef,
    afterGalleryRef,
    fileBefore,
    fileAfter,
    uploadMutation,
    submitMutation,
    canActInProgress,
    photosReadyForSubmit,
    onPickBefore,
    onPickAfter,
    handleUploadBefore,
    handleUploadAfter,
    t,
  } = useQuestOccurrenceDetail();

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('chores.detailsTitle')}
        isLoading
        backTo="/new-challenge/quests"
      />
    );
  }

  if (!familyGroup) {
    return (
      <ChallengePageScaffold
        title={t('chores.detailsTitle')}
        backTo="/new-challenge/quests"
      >
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  if (detailQuery.isLoading && !initialOccurrence) {
    return (
      <ChallengePageScaffold
        title={t('chores.detailsTitle')}
        isLoading
        backTo="/new-challenge/quests"
      />
    );
  }

  if (!occ && !detailQuery.isFetching) {
    return (
      <ChallengePageScaffold
        title={t('chores.detailsTitle')}
        backTo="/new-challenge/quests"
      >
        <Text color={getColor('text.dashboard.tileSubtitle')}>
          {t('chores.notFound')}
        </Text>
        <Button mt={4} onClick={() => navigate('/new-challenge/quests')}>
          {t('common.back')}
        </Button>
      </ChallengePageScaffold>
    );
  }

  if (!occ) {
    return (
      <ChallengePageScaffold
        title={t('chores.detailsTitle')}
        isLoading
        backTo="/new-challenge/quests"
      />
    );
  }

  return (
    <QuestOccurrenceDetailContent
      occ={occ}
      getColor={getColor}
      getFont={getFont}
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
      uploadIsPending={uploadMutation.isPending}
      submitIsPending={submitMutation.isPending}
      onSubmitForApproval={() => submitMutation.mutate()}
      canActInProgress={canActInProgress}
      photosReadyForSubmit={photosReadyForSubmit}
    />
  );
};
