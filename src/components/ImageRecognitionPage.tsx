import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex, Heading, Text, Box, Button, IconButton } from '@chakra-ui/react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { FiArrowLeft, FiRotateCw, FiCamera } from 'react-icons/fi';
import { api } from '../services';
import { convertQRData } from '../utils/qrCode';
import { useThemeTranslation } from '../hooks/useThemeTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { resolveAiErrorMessage } from '../utils/aiProviderError';

export const ImageRecognitionPage = () => {
  const { getColor, getFont } = useVisualTheme();
  const [loading, setLoading] = useState(true);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState('');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useThemeTranslation();

  // Determinar se é para expense ou revenue baseado na navegação
  const isRevenue = location.state?.from === 'revenue';
  
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false);

  const stopCamera = () => {
    // Parar stream de mídia
    if (streamRef.current) {
      try {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      } catch (err) {
        console.warn('Erro ao parar tracks:', err);
      }
      streamRef.current = null;
    }

    // Limpar elemento de vídeo
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (err) {
        console.warn('Erro ao limpar vídeo:', err);
      }
    }
  };

  const handleBack = () => {
    stopCamera();
    navigate('/home');
  };

  const handleImageAnalyzed = async (imageFile: File) => {
    if (!isMountedRef.current) return;

    try {
      setLoadingRead(true);
      stopCamera();

      let couponData;
      if (isRevenue) {
        const data = await api.revenueAnalyzeImage(imageFile);
        couponData = data;
        navigate('/revenue', {
          state: {
            couponData,
            scanned: true,
          },
        });
      } else {
        const data = await api.expenseAnalyzeImage(imageFile);
        couponData = convertQRData(data);
        navigate('/expense', {
          state: {
            couponData,
            scanned: true,
          },
        });
      }
    } catch (err) {
      console.error('Erro:', err);
      if (isMountedRef.current) {
        setError(
          resolveAiErrorMessage(
            err,
            t,
            'imageRecognitionPage.processingError',
          ),
        );
        setCapturedImage(null);
        // Reiniciar câmera após erro
        setTimeout(() => {
          if (isMountedRef.current && availableDevices.length > 0) {
            startCamera(availableDevices[currentDeviceIndex].deviceId);
          }
        }, 2000);
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingRead(false);
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Definir dimensões do canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenhar frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converter canvas para blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError(t('imageRecognitionPage.captureError'));
        return;
      }

      // Criar URL da imagem para preview
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // Criar arquivo da imagem
      const file = new File([blob], 'comprovante.jpg', { type: 'image/jpeg' });

      // Enviar para análise
      await handleImageAnalyzed(file);
    }, 'image/jpeg', 0.95);
  };

  const startCamera = async (deviceId: string) => {
    if (!isMountedRef.current || isInitializingRef.current) return;

    isInitializingRef.current = true;
    setLoading(true);
    setError('');
    setCapturedImage(null);

    try {
      const cameraContainer = document.getElementById('camera-container');

      if (!cameraContainer) {
        setError(t('imageRecognitionPage.cameraNotFound'));
        setLoading(false);
        return;
      }

      // Criar novo elemento de vídeo se necessário
      if (!videoRef.current) {
        const videoElem = document.createElement('video');
        videoElem.style.width = '100%';
        videoElem.style.height = '100%';
        videoElem.style.objectFit = 'cover';
        videoElem.setAttribute('playsinline', 'true');
        videoElem.setAttribute('autoplay', 'true');
        videoElem.setAttribute('muted', 'true');
        cameraContainer.innerHTML = '';
        cameraContainer.appendChild(videoElem);
        videoRef.current = videoElem;
      }

      // Iniciar stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          facingMode: currentDeviceIndex === 0 ? 'environment' : 'user',
        },
      });

      if (!isMountedRef.current) {
        for (const track of mediaStream.getTracks()) {
          track.stop();
        }
        return;
      }

      streamRef.current = mediaStream;
      videoRef.current.srcObject = mediaStream;

      // Aguardar o vídeo carregar
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current)
          return reject(new Error('Elemento de vídeo não encontrado'));

        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao carregar vídeo'));
        }, 5000);

        videoRef.current.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve();
        };

        videoRef.current.onerror = (err) => {
          clearTimeout(timeout);
          reject(new Error(err instanceof Error ? err.message : 'Erro no vídeo'));
        };
      });

      setError('');
    } catch (err) {
      console.error('Erro ao iniciar câmera:', err);
      if (isMountedRef.current) {
        setError(
          `Erro ao acessar câmera: ${
            err instanceof Error ? err.message : 'Erro desconhecido'
          }`,
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        isInitializingRef.current = false;
      }
    }
  };

  const switchCamera = () => {
    if (availableDevices.length <= 1 || isInitializingRef.current) return;

    stopCamera();
    const nextIndex = (currentDeviceIndex + 1) % availableDevices.length;
    setCurrentDeviceIndex(nextIndex);

    setTimeout(() => {
      if (isMountedRef.current) {
        startCamera(availableDevices[nextIndex].deviceId);
      }
    }, 300);
  };

  useEffect(() => {
    isMountedRef.current = true;

    const initializeCamera = async () => {
      setLoading(true);

      try {
        // Solicitar permissões e listar dispositivos
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput',
        );

        if (!isMountedRef.current) return;

        if (videoDevices.length === 0) {
          setError(t('imageRecognitionPage.noCameraFound'));
          setLoading(false);
          return;
        }

        setAvailableDevices(videoDevices);

        // Preferir câmera traseira se disponível
        let preferredIndex = 0;
        const backCameraIndex = videoDevices.findIndex(
          (device) =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('traseira') ||
            device.label.toLowerCase().includes('environment'),
        );

        if (backCameraIndex !== -1) {
          preferredIndex = backCameraIndex;
        }

        setCurrentDeviceIndex(preferredIndex);

        // Iniciar câmera
        await startCamera(videoDevices[preferredIndex].deviceId);
      } catch (err) {
        console.error('Erro na inicialização:', err);
        if (isMountedRef.current) {
          setError(
            `Erro ao inicializar: ${
              err instanceof Error ? err.message : 'Erro desconhecido'
            }`,
          );
          setLoading(false);
        }
      }
    };

    initializeCamera();

    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <LoadingOverlay text={t('imageRecognitionPage.loadingCamera')} typeLoading="open" />
      )}

      {loadingRead && (
        <LoadingOverlay text={t('imageRecognitionPage.analyzingImage')} typeLoading="read" />
      )}

      {/* Canvas escondido para captura */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

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
        {t('imageRecognitionPage.back')}
      </Button>

      {/* Botão para trocar câmera - só aparece se houver mais de uma */}
      {availableDevices.length > 1 && !capturedImage && (
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
          aria-label={t('imageRecognitionPage.switchCamera')}
          zIndex={10}
          isDisabled={loading || isInitializingRef.current}
        />
      )}

      <Heading
        mb={4}
        color={getColor('text.primary')}
        fontFamily={getFont('heading')}
      >
        {t('imageRecognitionPage.title')}
      </Heading>

      <Box
        id="camera-container"
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

        {capturedImage && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            backgroundImage={`url(${capturedImage})`}
            backgroundSize="cover"
            backgroundPosition="center"
          />
        )}
      </Box>

      {/* Botão de captura */}
      {!capturedImage && !loading && !error && (
        <Button
          mt={4}
          size="lg"
          leftIcon={<FiCamera />}
          onClick={capturePhoto}
          bg={getColor('button.background.primary')}
          color={getColor('button.text.primary')}
          border="1px solid"
          borderColor={getColor('button.border.neutral')}
          _hover={{
            bg: getColor('button.hover.background.default'),
            color: getColor('button.hover.text.default'),
            borderColor: getColor('button.hover.border.default'),
          }}
          fontFamily={getFont('body')}
        >
          {t('imageRecognitionPage.capture')}
        </Button>
      )}

      <Flex direction="column" align="center" mt={4}>
        <Text
          textAlign="center"
          color={getColor('text.primary')}
          fontFamily={getFont('body')}
        >
          {t('imageRecognitionPage.instructions')}
        </Text>

        {availableDevices.length > 1 && (
          <Text
            fontSize="sm"
            color={getColor('text.secondary')}
            mt={2}
            fontFamily={getFont('body')}
          >
            {t('imageRecognitionPage.camera', {
              name:
                availableDevices[currentDeviceIndex]?.label ||
                t('imageRecognitionPage.defaultCamera'),
              current: currentDeviceIndex + 1,
              total: availableDevices.length,
            })}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

