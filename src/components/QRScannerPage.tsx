import { Flex, Heading, Text, Box, Button, IconButton } from '@chakra-ui/react';
import { FiArrowLeft, FiRotateCw } from 'react-icons/fi';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useQRScanner } from '../hooks/useQRScanner';

export const QRScannerPage = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const {
    loading,
    loadingRead,
    error,
    availableDevices,
    currentDeviceIndex,
    isInitializingRef,
    handleBack,
    switchCamera,
  } = useQRScanner();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg={getColor('background.primary')}
      color={getColor('text.primary')}
      p={4}
    >
      {loading && (
        <LoadingOverlay
          text={t('qrScannerPage.loadingCamera')}
          typeLoading="open"
        />
      )}

      {loadingRead && (
        <LoadingOverlay
          text={t('qrScannerPage.loadingCoupon')}
          typeLoading="read"
        />
      )}

      <Button
        position="absolute"
        top="4"
        left="4"
        onClick={handleBack}
        leftIcon={<FiArrowLeft />}
        variant="ghost"
        color={getColor('text.primary')}
        bg={getColor('background.qrScanner')}
        border="1px solid"
        borderColor={getColor('border.primary')}
        _hover={{
          bg: getColor('background.selected'),
          color: getColor('text.accent'),
        }}
        zIndex={10}
      >
        {t('qrScannerPage.back')}
      </Button>

      {availableDevices.length > 1 && (
        <IconButton
          position="absolute"
          top="4"
          right="4"
          onClick={switchCamera}
          icon={<FiRotateCw />}
          variant="ghost"
          color={getColor('text.primary')}
          bg={getColor('background.qrScanner')}
          border="1px solid"
          borderColor={getColor('border.primary')}
          _hover={{
            bg: getColor('background.selected'),
            color: getColor('text.accent'),
          }}
          aria-label={t('qrScannerPage.switchCamera')}
          zIndex={10}
          isDisabled={loading || isInitializingRef.current}
        />
      )}

      <Heading
        mb={4}
        color={getColor('text.primary')}
        fontFamily={getFont('heading')}
      >
        {t('qrScannerPage.title')}
      </Heading>

      <Box
        id="scanner-container"
        width="100%"
        maxWidth="600px"
        height="400px"
        border="2px solid"
        borderColor={getColor('border.primary')}
        borderRadius="md"
        overflow="hidden"
        position="relative"
      >
        {error && (
          <Flex height="100%" align="center" justify="center">
            <Text color={getColor('status.error')} textAlign="center" p={4}>
              {error}
            </Text>
          </Flex>
        )}
      </Box>

      <Flex direction="column" align="center" mt={4}>
        <Text
          textAlign="center"
          color={getColor('text.primary')}
          fontFamily={getFont('body')}
        >
          {t('qrScannerPage.instructions')}
        </Text>

        {availableDevices.length > 1 && (
          <Text
            fontSize="sm"
            color={getColor('text.secondary')}
            mt={2}
            fontFamily={getFont('body')}
          >
            {t('qrScannerPage.camera', {
              name:
                availableDevices[currentDeviceIndex]?.label ||
                t('qrScannerPage.defaultCamera'),
              current: currentDeviceIndex + 1,
              total: availableDevices.length,
            })}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
