import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiCamera, FiRotateCw, FiX } from 'react-icons/fi';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';

type CameraCaptureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  title: string;
  instructions: string;
  fileName?: string;
};

export const CameraCaptureModal = ({
  isOpen,
  onClose,
  onCapture,
  title,
  instructions,
  fileName = 'photo.jpg',
}: CameraCaptureModalProps) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceIndex, setDeviceIndex] = useState(0);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(
    async (preferredDeviceId?: string) => {
      if (!isMountedRef.current) return;

      setLoading(true);
      setError('');
      stopCamera();

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: preferredDeviceId
            ? { deviceId: { exact: preferredDeviceId } }
            : { facingMode: { ideal: 'environment' } },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMountedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const videoInputs = (await navigator.mediaDevices.enumerateDevices()).filter(
          (device) => device.kind === 'videoinput',
        );
        if (videoInputs.length > 0) {
          setDevices(videoInputs);
          if (preferredDeviceId) {
            const idx = videoInputs.findIndex((d) => d.deviceId === preferredDeviceId);
            if (idx >= 0) setDeviceIndex(idx);
          }
        }
      } catch (err) {
        console.error('Erro ao acessar câmera:', err);
        if (isMountedRef.current) {
          setError(t('health.prescriptions.form.cameraAccessError'));
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [stopCamera, t],
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setError('');
      setDevices([]);
      setDeviceIndex(0);
      return;
    }

    void startCamera();
  }, [isOpen, startCamera, stopCamera]);

  const handleSwitchCamera = () => {
    if (devices.length <= 1) return;
    const nextIndex = (deviceIndex + 1) % devices.length;
    setDeviceIndex(nextIndex);
    void startCamera(devices[nextIndex].deviceId);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context || video.videoWidth <= 0 || video.videoHeight <= 0) {
      setError(t('imageRecognitionPage.captureError'));
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError(t('imageRecognitionPage.captureError'));
          return;
        }
        onCapture(new File([blob], fileName, { type: 'image/jpeg' }));
        onClose();
      },
      'image/jpeg',
      0.92,
    );
  };

  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const cardBg = getColor('background.familyGroup.card');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');
  const cameraPreviewBg = getColor('chakraColors.black');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent bg={cardBg} m={0} borderRadius={0} maxH="100dvh">
        <ModalHeader color={textPrimary} py={3} px={4}>
          <Flex align="center" justify="space-between">
            <Text fontSize="md" fontWeight="semibold">
              {title}
            </Text>
            <IconButton
              aria-label={t('common.close')}
              icon={<FiX />}
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </Flex>
        </ModalHeader>

        <ModalBody px={4} py={0} display="flex" flexDirection="column" gap={3}>
          <Text color={textSub} fontSize="sm">
            {instructions}
          </Text>

          <Box
            position="relative"
            flex={1}
            minH="45vh"
            borderRadius="lg"
            overflow="hidden"
            bg={cameraPreviewBg}
          >
            <Box
              as="video"
              ref={videoRef}
              playsInline
              autoPlay
              muted
              w="100%"
              h="100%"
              objectFit="cover"
            />
            {loading ? (
              <Flex
                position="absolute"
                inset={0}
                align="center"
                justify="center"
                bg={cameraPreviewBg}
              >
                <Spinner color={primaryBtnText} size="lg" />
              </Flex>
            ) : null}
          </Box>

          {error ? (
            <Text color={getColor('status.error')} fontSize="sm">
              {error}
            </Text>
          ) : null}

          {devices.length > 1 ? (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiRotateCw />}
              alignSelf="flex-start"
              onClick={handleSwitchCamera}
              isDisabled={loading}
            >
              {t('imageRecognitionPage.switchCamera')}
            </Button>
          ) : null}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </ModalBody>

        <ModalFooter px={4} pb={6} pt={2} gap={2}>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            leftIcon={<FiCamera />}
            bg={primaryBtnBg}
            color={primaryBtnText}
            _hover={{ opacity: 0.9 }}
            onClick={handleCapture}
            isDisabled={loading || !!error}
          >
            {t('imageRecognitionPage.capture')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
