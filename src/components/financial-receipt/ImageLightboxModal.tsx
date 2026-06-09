import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { FiDownload, FiMinus, FiPlus, FiX } from 'react-icons/fi';
import { DriveImage } from '../DriveImage';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { toDisplayableImageUrl } from '../../utils/formatString';

type Props = {
  url: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ImageLightboxModal = ({ url, isOpen, onClose }: Props) => {
  const { t } = useThemedTranslation();
  const toast = useToast();
  const [scale, setScale] = useState(1);

  const handleDownload = useCallback(async () => {
    const displayUrl = toDisplayableImageUrl(url);
    if (!displayUrl) return;
    try {
      const res = await fetch(displayUrl);
      if (!res.ok) throw new Error('fetch_failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `receipt-photo-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const opened = window.open(displayUrl, '_blank');
      if (!opened) {
        toast({
          title: t('common.error'),
          description: t('financialSteps.photos.downloadError'),
          status: 'error',
          duration: 3000,
        });
      }
    }
  }, [url, t, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent bg="transparent" boxShadow="none" m={0}>
        <ModalBody
          p={0}
          display="flex"
          flexDirection="column"
          minH="100vh"
          position="relative"
        >
          <Flex
            position="absolute"
            top={4}
            right={4}
            zIndex={2}
            gap={2}
          >
            <IconButton
              aria-label={t('financialSteps.photos.zoomOut')}
              icon={<FiMinus />}
              onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            />
            <IconButton
              aria-label={t('financialSteps.photos.zoomIn')}
              icon={<FiPlus />}
              onClick={() => setScale((s) => Math.min(3, s + 0.25))}
            />
            <IconButton
              aria-label={t('financialSteps.photos.download')}
              icon={<FiDownload />}
              onClick={() => void handleDownload()}
            />
            <IconButton
              aria-label={t('common.close')}
              icon={<FiX />}
              onClick={onClose}
            />
          </Flex>
          <Flex flex="1" align="center" justify="center" overflow="auto" p={4}>
            <Box
              transform={`scale(${scale})`}
              transition="transform 0.2s"
              maxW="100%"
            >
              <DriveImage
                src={url}
                alt=""
                maxH="80vh"
                objectFit="contain"
              />
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
