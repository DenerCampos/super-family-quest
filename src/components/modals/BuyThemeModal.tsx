import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Image,
  VStack,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { ThemeConfig } from '../../services/theme';

interface BuyThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  onConfirm: () => void;
}

export const BuyThemeModal = ({ isOpen, onClose, theme, onConfirm }: BuyThemeModalProps) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent
        bg={getColor('background.primary')}
        color={getColor('text.primary')}
      >
        <ModalHeader>{t('profile.themes.buyTheme')}</ModalHeader>
        <ModalCloseButton color={getColor('text.primary')} />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box
              position="relative"
              h="200px"
              borderRadius="md"
              overflow="hidden"
            >
              <Image
                src={`/assets/images/${theme.background}`}
                alt={theme.name}
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              {theme.name}
            </Text>
            <Text>{theme.description}</Text>
            <Text color={getColor('text.coin')} fontWeight="bold">
              {t('profile.themes.cost', { count: theme.requiredCoins })}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter gap={2}>
          <Button
            onClick={onClose}
            variant="outline"
            color={getColor('text.primary')}
            bg={getColor('background.tertiary')}
            border="1px solid"
            borderColor={getColor('border.primary')}
            _hover={{
              bg: getColor('background.selected'),
              color: getColor('text.accent'),
            }}
          >
            {t('profile.themes.cancel')}
          </Button>
          <Button
            onClick={async () => {
              setIsLoading(true);
              try {
                await onConfirm();
                onClose();
              } catch (error) {
                // Não fecha o modal se houver erro
                console.error('Erro ao confirmar compra:', error);
              } finally {
                setIsLoading(false);
              }
            }}
            isLoading={isLoading}
            loadingText={t('profile.themes.buying')}
            variant="outline"
            color={getColor('text.primary')}
            bg={getColor('background.tertiary')}
            border="1px solid"
            borderColor={getColor('border.primary')}
            _hover={{
              bg: getColor('background.selected'),
              color: getColor('text.accent'),
            }}
          >
            {t('profile.themes.buy')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
