import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { choreQueryKeys } from '../../hooks/choreQueryKeys';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { formatCurrency } from '../../utils/formatCurrency';
import { toDisplayableImageUrl } from '../../utils/formatString';
import type { ChoreOccurrenceResponseDto } from '../../types/chore';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';

export const ApprovalsView = () => {
  const { familyGroup, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { profile, loadProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ChoreOccurrenceResponseDto | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState('');

  const groupId = familyGroup?.id;
  const userId = profile?.user.id ?? '';
  const userIsAdmin = familyGroup ? isAdmin(familyGroup, userId) : false;

  useEffect(() => {
    if (!isLoadingGroup && familyGroup && !userIsAdmin) {
      toast({ title: t('chores.adminOnly'), status: 'warning' });
      navigate('/new-resources/quests', { replace: true });
    }
  }, [isLoadingGroup, familyGroup, userIsAdmin, navigate, toast, t]);

  const pendingQuery = useQuery({
    queryKey: choreQueryKeys.occurrences(groupId ?? '', 'pending-approval'),
    queryFn: () =>
      api.choreListPendingApproval(groupId!, { page: 1, limit: 50 }),
    enabled: !!groupId && userIsAdmin,
    refetchInterval: 45_000,
  });

  const approveMutation = useMutation({
    mutationFn: (occurrenceId: string) =>
      api.choreApproveOccurrence(groupId!, occurrenceId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      await loadProfile();
      toast({ title: t('chores.approved'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chores.approveError'),
        status: 'error',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.choreRejectOccurrence(groupId!, id, { reason }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      onClose();
      setRejectTarget(null);
      setRejectReason('');
      await loadProfile();
      toast({ title: t('chores.rejected'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chores.rejectError'),
        status: 'error',
      });
    },
  });

  const returnForAdjustmentMutation = useMutation({
    mutationFn: (occurrenceId: string) =>
      api.choreReturnOccurrenceForAdjustment(groupId!, occurrenceId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      await loadProfile();
      toast({ title: t('chores.returnedForAdjustment'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chores.returnForAdjustmentError'),
        status: 'error',
      });
    },
  });

  const openImagePreview = (url: string) => {
    const display = toDisplayableImageUrl(url) || url;
    setPreviewUrl(display);
    onImageOpen();
  };

  const openReject = (item: ChoreOccurrenceResponseDto) => {
    setRejectTarget(item);
    setRejectReason('');
    onOpen();
  };

  const confirmReject = () => {
    if (!rejectTarget || !rejectReason.trim()) {
      toast({ title: t('chores.rejectReasonRequired'), status: 'warning' });
      return;
    }
    if (rejectReason.length > 2000) {
      toast({ title: t('chores.rejectReasonTooLong'), status: 'warning' });
      return;
    }
    rejectMutation.mutate({ id: rejectTarget.id, reason: rejectReason.trim() });
  };

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.approvals.title')}
        isLoading
      />
    );
  }

  if (!familyGroup) {
    return (
      <ChallengePageScaffold title={t('newChallenge.tiles.approvals.title')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  if (!userIsAdmin) {
    return (
      <ChallengePageScaffold
        title={t('newChallenge.tiles.approvals.title')}
        isLoading
      />
    );
  }

  const rows = pendingQuery.data?.data ?? [];

  return (
    <ChallengePageScaffold title={t('newChallenge.tiles.approvals.title')}>
      <VStack align="stretch" spacing={4} pb={8}>
        {pendingQuery.isLoading ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>{t('common.loading')}</Text>
        ) : rows.length === 0 ? (
          <Text color={getColor('text.dashboard.tileSubtitle')}>{t('chores.emptyPending')}</Text>
        ) : (
          rows.map((item) => {
            const reward = item.snapshotRewardMoney ?? item.definition.rewardValue;
            return (
              <Box
                key={item.id}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={getColor('border.familyGroup.card')}
                bg={getColor('background.familyGroup.card')}
              >
                <Text
                  fontWeight="bold"
                  fontFamily={getFont('body')}
                  color={getColor('text.familyGroup.title')}
                  mb={1}
                >
                  {item.definition.title}
                </Text>
                {item.assignedTo ? (
                  <Text fontSize="sm" color={getColor('text.dashboard.tileSubtitle')} mb={2}>
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
                        onClick={() =>
                          openImagePreview(item.photoBeforeUrl as string)
                        }
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
                          toDisplayableImageUrl(item.photoAfterUrl) ||
                          item.photoAfterUrl
                        }
                        alt=""
                        maxH="200px"
                        w="100%"
                        objectFit="contain"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() =>
                          openImagePreview(item.photoAfterUrl as string)
                        }
                      />
                    </Box>
                  ) : null}
                </VStack>
                <Flex mt={3} gap={2} flexWrap="wrap">
                  <Button
                    size="sm"
                    bg={getColor('button.background.revenue')}
                    color={getColor('button.text.revenue')}
                    onClick={() => approveMutation.mutate(item.id)}
                    isLoading={
                      approveMutation.isPending &&
                      approveMutation.variables === item.id
                    }
                  >
                    {t('chores.approve')}
                  </Button>
                  <Button
                    size="sm"
                    bg={getColor('status.warning')}
                    color={getColor('button.text.revenue')}
                    onClick={() => returnForAdjustmentMutation.mutate(item.id)}
                    isLoading={
                      returnForAdjustmentMutation.isPending &&
                      returnForAdjustmentMutation.variables === item.id
                    }
                  >
                    {t('chores.returnForAdjustment')}
                  </Button>
                  <Button
                    size="sm"
                    bg={getColor('status.error')}
                    color={getColor('button.text.revenue')}
                    onClick={() => openReject(item)}
                  >
                    {t('chores.reject')}
                  </Button>
                </Flex>
              </Box>
            );
          })
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={getColor('background.primary')}>
          <ModalHeader color={getColor('text.familyGroup.title')}>
            {t('chores.rejectModalTitle')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('chores.rejectReasonPlaceholder')}
              borderColor={getColor('border.primary')}
              color={getColor('text.familyGroup.title')}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t('common.close')}
            </Button>
            <Button
              bg={getColor('status.error')}
              color={getColor('text.header')}
              onClick={confirmReject}
              isLoading={rejectMutation.isPending}
            >
              {t('chores.confirmReject')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isImageOpen}
        onClose={() => {
          onImageClose();
          setPreviewUrl(null);
        }}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent bg={getColor('background.primary')} maxW="90vw">
          <ModalCloseButton />
          <ModalBody p={4}>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt=""
                maxH="85vh"
                w="100%"
                objectFit="contain"
                mx="auto"
              />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChallengePageScaffold>
  );
};
