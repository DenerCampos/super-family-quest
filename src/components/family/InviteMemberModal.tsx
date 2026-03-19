import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { api } from '../../services';

type InviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onInviteSent: () => void;
};

export const InviteMemberModal = ({
  isOpen,
  onClose,
  groupId,
  onInviteSent,
}: InviteMemberModalProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;

    setIsInviting(true);
    try {
      await api.familyGroupInvite(groupId, email.trim());
      toast({
        title: t('common.success'),
        description: t('familyGroup.inviteSent'),
        status: 'success',
        duration: 3000,
      });
      setEmail('');
      onInviteSent();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.inviteError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent bg={getColor('background.primary')} color={getColor('text.primary')}>
        <ModalHeader fontFamily={getFont('heading')}>
          {t('familyGroup.invite')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Input
              placeholder={t('familyGroup.inviteEmailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              fontFamily={getFont('body')}
              bg={getColor('input.background')}
              color={getColor('text.primary')}
            />
            <Button
              w="full"
              bg={getColor('background.tertiary')}
              color={getColor('text.primary')}
              _hover={{ bg: getColor('background.selected') }}
              isLoading={isInviting}
              loadingText={t('familyGroup.inviting')}
              isDisabled={!email.trim()}
              onClick={handleInvite}
              fontFamily={getFont('body')}
            >
              {t('familyGroup.invite')}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
