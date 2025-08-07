import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import { Flex, Heading, Text, Box, Button, IconButton } from '@chakra-ui/react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { FiArrowLeft, FiRotateCw } from 'react-icons/fi';
import { api } from '../services';
import { parseNFCeQRCode } from '../utils/qrCode';
import { useThemeTranslation } from '../hooks/useThemeTranslation';

export const QRScannerPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState('');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const navigate = useNavigate();
  const { t } = useThemeTranslation();
  // Usar useRef para manter referências estáveis
  const controlsRef = useRef<IScannerControls | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false);

  const stopCamera = () => {
    // console.log('Parando câmera...');

    // Parar controles do scanner
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (err) {
        console.warn('Erro ao parar controles:', err);
      }
      controlsRef.current = null;
    }

    // Parar stream de mídia
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          // console.log('Parando track:', track.kind);
          track.stop();
        });
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
        // Não remover o elemento aqui, vamos reutilizá-lo
      } catch (err) {
        console.warn('Erro ao limpar vídeo:', err);
      }
    }
  };

  const handleBack = () => {
    stopCamera();
    navigate('/home');
  };

  const handleQRCodeScanned = async (qrData: string) => {
    if (!isMountedRef.current) return;

    try {
      setLoadingRead(true);
      stopCamera();

      const qrCodeData = parseNFCeQRCode(qrData);
      const data = await api.couponReader({
        code: qrCodeData?.rawData || '',
      });

      if (isMountedRef.current) {
        navigate('/home', {
          state: {
            couponData: data,
            scanned: true,
          },
        });
      }
    } catch (err) {
      console.error('Erro:', err);
      if (isMountedRef.current) {
        setError('Falha ao processar QR Code');
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingRead(false);
      }
    }
  };

  const startScanner = async (deviceId: string) => {
    if (!isMountedRef.current || isInitializingRef.current) return;

    isInitializingRef.current = true;
    // console.log('Iniciando scanner com dispositivo:', deviceId);
    setLoading(true);

    try {
      const scannerContainer = document.getElementById('scanner-container');

      if (!scannerContainer) {
        setError('Elemento de scanner não encontrado');
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
        scannerContainer.innerHTML = '';
        scannerContainer.appendChild(videoElem);
        videoRef.current = videoElem;
      }

      // console.log('Solicitando acesso à câmera...');

      // Iniciar stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          facingMode: currentDeviceIndex === 0 ? 'environment' : 'user',
        },
      });

      if (!isMountedRef.current) {
        // console.log('Componente desmontado, parando stream');
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }

      // console.log('Stream obtido, configurando vídeo...');
      streamRef.current = mediaStream;
      videoRef.current.srcObject = mediaStream;

      // Aguardar o vídeo carregar
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current)
          return reject('Elemento de vídeo não encontrado');

        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao carregar vídeo'));
        }, 5000);

        videoRef.current.onloadedmetadata = () => {
          clearTimeout(timeout);
          // console.log('Metadados do vídeo carregados');
          resolve();
        };

        videoRef.current.onerror = (err) => {
          clearTimeout(timeout);
          reject(err);
        };
      });

      // console.log('Vídeo reproduzindo, iniciando leitor QR...');

      // Iniciar leitor QR Code
      const codeReader = new BrowserQRCodeReader();
      controlsRef.current = await codeReader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result) => {
          if (result && isMountedRef.current) {
            // console.log('QR Code detectado:', result.getText());
            handleQRCodeScanned(result.getText());
          }
        },
      );

      // console.log('Scanner iniciado com sucesso');
      setError('');
    } catch (err) {
      console.error('Erro ao iniciar scanner:', err);
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

    // console.log('Trocando câmera...');
    stopCamera();
    const nextIndex = (currentDeviceIndex + 1) % availableDevices.length;
    setCurrentDeviceIndex(nextIndex);

    // Aguardar um pouco antes de iniciar nova câmera
    setTimeout(() => {
      if (isMountedRef.current) {
        startScanner(availableDevices[nextIndex].deviceId);
      }
    }, 300);
  };

  useEffect(() => {
    isMountedRef.current = true;

    const initializeCamera = async () => {
      // console.log('Inicializando câmera...');
      setLoading(true);

      try {
        // Solicitar permissões e listar dispositivos
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        // console.log('Dispositivos encontrados:', devices);

        if (!isMountedRef.current) return;

        if (devices.length === 0) {
          setError('Nenhuma câmera encontrada');
          setLoading(false);
          return;
        }

        setAvailableDevices(devices);

        // Preferir câmera traseira se disponível
        let preferredIndex = 0;
        const backCameraIndex = devices.findIndex(
          (device) =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('traseira') ||
            device.label.toLowerCase().includes('environment'),
        );

        if (backCameraIndex !== -1) {
          preferredIndex = backCameraIndex;
        }

        // console.log(
        //   'Usando câmera no índice:',
        //   preferredIndex,
        //   devices[preferredIndex]?.label,
        // );
        setCurrentDeviceIndex(preferredIndex);

        // Iniciar scanner
        await startScanner(devices[preferredIndex].deviceId);
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
      // console.log('Cleanup do componente');
      isMountedRef.current = false;
      stopCamera();
    };
  }, []);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="purple.800"
      color="white"
      p={4}
    >
      {loading && (
        <LoadingOverlay text="Carregando câmera" typeLoading="open" />
      )}

      {loadingRead && (
        <LoadingOverlay text="Lendo cupom fiscal" typeLoading="read" />
      )}

      <Button
        position="absolute"
        top="4"
        left="4"
        onClick={handleBack}
        leftIcon={<FiArrowLeft />}
        variant="ghost"
        colorScheme="whiteAlpha"
        zIndex={10}
      >
        {t('qrScannerPage.back')}
      </Button>

      {/* Botão para trocar câmera - só aparece se houver mais de uma */}
      {availableDevices.length > 1 && (
        <IconButton
          position="absolute"
          top="4"
          right="4"
          onClick={switchCamera}
          icon={<FiRotateCw />}
          variant="ghost"
          colorScheme="whiteAlpha"
          aria-label="Trocar câmera"
          zIndex={10}
          isDisabled={loading || isInitializingRef.current}
        />
      )}

      <Heading mb={4}>Posicione o QR Code</Heading>

      <Box
        id="scanner-container"
        width="100%"
        maxWidth="600px"
        height="400px"
        border="2px solid"
        borderColor="purple.500"
        borderRadius="md"
        overflow="hidden"
        position="relative"
      >
        {error && (
          <Flex height="100%" align="center" justify="center">
            <Text color="red.300" textAlign="center" p={4}>
              {error}
            </Text>
          </Flex>
        )}
      </Box>

      <Flex direction="column" align="center" mt={4}>
        <Text textAlign="center">
          {t('qrScannerPage.instructions')}
        </Text>

        {availableDevices.length > 1 && (
          <Text fontSize="sm" color="purple.200" mt={2}>
            Câmera: {availableDevices[currentDeviceIndex]?.label || 'Padrão'}(
            {currentDeviceIndex + 1}/{availableDevices.length})
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
