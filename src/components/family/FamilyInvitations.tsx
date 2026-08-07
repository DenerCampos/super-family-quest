import { useState, useEffect, useCallback } from 'react';
import {
  VStack,
  Text,
  Flex,
  Button,
  Spinner,
  Box,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { api } from '../../services';
import type { FamilyGroupMemberResponseDto } from '../../types/familyGroup';

type FamilyInvitationsProps = {
  onInvitationHandled: () => void;
};

export const FamilyInvitations = ({ onInvitationHandled }: FamilyInvitationsProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();
  const [invitations, setInvitations] = useState<FamilyGroupMemberResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<{
    id: string;
    type: 'accept' | 'reject';
  } | null>(null);

  const loadInvitations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.familyGroupListInvitations();
      setInvitations(data);
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.loadError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleAccept = async (id: string) => {
    setProcessingAction({ id, type: 'accept' });
    try {
      await api.familyGroupAcceptInvitation(id);
      toast({
        title: t('common.success'),
        description: t('familyGroup.accepted'),
        status: 'success',
        duration: 3000,
      });
      await loadInvitations();
      onInvitationHandled();
    } catch (error) {
      const description =
        isAxiosError(error) && error.response?.status === 409
          ? t('familyGroup.alreadyMemberOfThisGroup')
          : t('familyGroup.acceptError');
      toast({
        title: t('common.error'),
        description,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingAction({ id, type: 'reject' });
    try {
      await api.familyGroupRejectInvitation(id);
      toast({
        title: t('common.success'),
        description: t('familyGroup.rejected'),
        status: 'success',
        duration: 3000,
      });
      await loadInvitations();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.rejectError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setProcessingAction(null);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" py={6}>
        <Spinner color={getColor('text.familyGroup.primary')} />
      </Flex>
    );
  }

  if (invitations.length === 0) {
    return (
      <Text
        textAlign="center"
        py={8}
        color={getColor('text.familyGroup.secondary')}
        fontFamily={getFont('body')}
      >
        {t('familyGroup.noInvitations')}
      </Text>
    );
  }

  return (
    <VStack spacing={3} align="stretch" p={4}>
      {invitations.map((invitation) => (
        <Box
          key={invitation.id}
          p={4}
          bg={getColor('background.familyGroup.card')}
          borderRadius="md"
          borderWidth="1px"
          borderColor={getColor('border.familyGroup.card')}
          boxShadow="sm"
        >
          <Text
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.familyGroup.title')}
            mb={1}
          >
            {t('familyGroup.invitedBy')}: {invitation.invitedBy.name}
          </Text>
          <Text
            fontSize="sm"
            color={getColor('text.familyGroup.secondary')}
            fontFamily={getFont('body')}
            mb={3}
          >
            {invitation.invitedEmail}
          </Text>
          <Flex gap={2}>
            <Button
              size="sm"
              bg={getColor('button.background.revenue')}
              color={getColor('button.text.primary')}
              _hover={{ opacity: 0.8 }}
              isLoading={processingAction?.id === invitation.id && processingAction.type === 'accept'}
              isDisabled={processingAction?.id === invitation.id && processingAction.type === 'reject'}
              loadingText={t('familyGroup.accepting')}
              onClick={() => handleAccept(invitation.id)}
              fontFamily={getFont('body')}
              flex={1}
            >
              {t('familyGroup.accept')}
            </Button>
            <Button
              size="sm"
              bg={getColor('button.background.expense')}
              color={getColor('button.text.primary')}
              _hover={{ opacity: 0.8 }}
              isLoading={processingAction?.id === invitation.id && processingAction.type === 'reject'}
              isDisabled={processingAction?.id === invitation.id && processingAction.type === 'accept'}
              loadingText={t('familyGroup.rejecting')}
              onClick={() => handleReject(invitation.id)}
              fontFamily={getFont('body')}
              flex={1}
            >
              {t('familyGroup.reject')}
            </Button>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
};
