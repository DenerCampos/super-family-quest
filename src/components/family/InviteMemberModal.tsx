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
  Box,
  List,
  ListItem,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useUserEmailSearch } from '../../hooks/useUserEmailSearch';
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
  const [isInviting, setIsInviting] = useState(false);
  const {
    email,
    suggestions,
    isSearching,
    showSuggestions,
    handleEmailChange,
    selectSuggestion,
    revealSuggestions,
    clearSearch,
  } = useUserEmailSearch(isOpen);

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
      clearSearch();
      onInviteSent();
      onClose();
    } catch {
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
          <VStack spacing={4} align="stretch">
            <Box position="relative">
              <Input
                placeholder={t('familyGroup.inviteEmailPlaceholder')}
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onFocus={revealSuggestions}
                type="email"
                autoComplete="off"
                fontFamily={getFont('body')}
                bg={getColor('input.background')}
                color={getColor('text.primary')}
              />
              {isSearching && (
                <Spinner
                  size="xs"
                  position="absolute"
                  right={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color={getColor('text.familyGroup.secondary')}
                />
              )}
              {showSuggestions && suggestions.length > 0 && (
                <List
                  position="absolute"
                  zIndex={10}
                  mt={1}
                  w="full"
                  maxH="180px"
                  overflowY="auto"
                  bg={getColor('input.backgroundSecondary')}
                  border="1px solid"
                  borderColor={getColor('input.border')}
                  borderRadius="md"
                  boxShadow="md"
                >
                  {suggestions.map((user) => (
                    <ListItem
                      key={user.id}
                      px={3}
                      py={2}
                      cursor="pointer"
                      fontFamily={getFont('body')}
                      color={getColor('text.primary')}
                      _hover={{ bg: getColor('background.selected') }}
                      onClick={() => selectSuggestion(user)}
                    >
                      <Text fontSize="sm" fontWeight="medium">
                        {user.name}
                      </Text>
                      <Text fontSize="xs" color={getColor('text.familyGroup.secondary')}>
                        {user.email}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            <Text fontSize="xs" color={getColor('text.familyGroup.secondary')} fontFamily={getFont('body')}>
              {t('familyGroup.inviteSearchHint')}
            </Text>
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
