import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { DeleteAccountModal } from '../modals/DeleteAccountModal';

export const DeleteAccountSection = () => {
  const { profile, isDemo } = useAuth();
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userId = profile?.user.id;

  if (isDemo || !userId) {
    return null;
  }

  return (
    <>
      <Box
        w="full"
        pt={6}
        mt={2}
        borderTopWidth="1px"
        borderColor={getColor('border.noSelect')}
      >
        <Text color={getColor('text.profile.secondary')} fontSize="sm" mb={3}>
          {t('profile.deleteAccount.sectionDescription')}
        </Text>
        <Button
          colorScheme={getColor('button.danger')}
          variant="outline"
          w="full"
          onClick={onOpen}
        >
          {t('profile.deleteAccount.button')}
        </Button>
      </Box>

      <DeleteAccountModal isOpen={isOpen} onClose={onClose} userId={userId} />
    </>
  );
};
