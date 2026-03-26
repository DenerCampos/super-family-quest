import { Box, Button, CloseButton, Flex, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { MdInstallMobile } from 'react-icons/md';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { usePWAInstall } from '../hooks/usePWAInstall';

const STORAGE_KEY = 'pwa-banner-dismissed';

export function PWAInstallBanner() {
  const { theme } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { canInstall, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  );

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  if (!canInstall || dismissed) return null;

  return (
    <Box
      position="fixed"
      bottom="70px"
      left="50%"
      transform="translateX(-50%)"
      w="calc(100% - 32px)"
      maxW="440px"
      zIndex={1000}
      bg={theme.colors.background.primary}
      borderRadius="xl"
      boxShadow="0 4px 20px rgba(0,0,0,0.3)"
      p={3}
    >
      <Flex align="center" gap={3}>
        <Box
          as={MdInstallMobile}
          boxSize={6}
          color={theme.colors.text.primary}
          flexShrink={0}
        />
        <Box flex={1}>
          <Text
            color={theme.colors.text.primary}
            fontSize="sm"
            fontWeight="bold"
          >
            {t('pwa.installTitle')}
          </Text>
          <Text color={theme.colors.text.secondary} fontSize="xs">
            {t('pwa.installDescription')}
          </Text>
        </Box>
        <Button
          size="sm"
          bg={theme.colors.button.background.neutral}
          color={theme.colors.button.text.primary}
          _hover={{
            bg: theme.colors.button.hover.background.neutral,
          }}
          onClick={promptInstall}
          flexShrink={0}
        >
          {t('pwa.installButton')}
        </Button>
        <CloseButton
          size="sm"
          color={theme.colors.text.primary}
          onClick={handleDismiss}
        />
      </Flex>
    </Box>
  );
}
