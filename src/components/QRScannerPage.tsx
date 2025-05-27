import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import { Flex, Heading, Text, Box, Button } from '@chakra-ui/react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { FiArrowLeft } from 'react-icons/fi';
import { api } from '../services';
import { parseNFCeQRCode } from '../utils/qrCode';

export const QRScannerPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Usar useRef para manter referências estáveis
  const controlsRef = useRef<IScannerControls | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stopCamera = () => {
    // Parar controles do scanner
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }

    // Parar stream de mídia
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        streamRef.current?.removeTrack(track);
      });
      streamRef.current = null;
    }

    // Remover elemento de vídeo
    if (videoRef.current) {
      videoRef.current.remove();
      videoRef.current = null;
    }
  };

  const handleBack = () => {
    stopCamera();
    navigate('/home');
  };

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let isMounted = true;

    const startScanner = async () => {
      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();

        if (!isMounted) return;

        if (devices.length === 0) {
          setError('Nenhuma câmera encontrada');
          setLoading(false);
          return;
        }

        const deviceId = devices[0].deviceId;
        const scannerContainer = document.getElementById('scanner-container');

        if (!scannerContainer) {
          setError('Elemento de scanner não encontrado');
          setLoading(false);
          return;
        }

        // Limpar container
        scannerContainer.innerHTML = '';

        // Criar novo elemento de vídeo
        const videoElem = document.createElement('video');
        videoElem.style.width = '100%';
        videoElem.style.height = '100%';
        scannerContainer.appendChild(videoElem);
        videoRef.current = videoElem;

        // Iniciar stream
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: deviceId },
            facingMode: 'environment',
          },
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        videoElem.srcObject = mediaStream;
        await videoElem.play();

        // Iniciar leitor
        controlsRef.current = await codeReader.decodeFromVideoDevice(
          deviceId,
          videoElem,
          (result) => {
            if (result) {
              handleQRCodeScanned(result.getText());
            }
          },
        );

        setLoading(false);
      } catch (err) {
        console.error('Erro:', err);
        if (isMounted) {
          setError('Não foi possível acessar a câmera');
          setLoading(false);
        }
      }
    };

    const handleQRCodeScanned = async (qrData: string) => {
      try {
        setLoadingRead(true);
        stopCamera();

        const qrCodeData = parseNFCeQRCode(qrData);
        const data = await api.couponReader({
          code: qrCodeData?.rawData || '',
        });

        navigate('/home', {
          state: {
            couponData: data,
            scanned: true,
          },
        });
      } catch (err) {
        console.error('Erro:', err);
        navigate('/', { state: { error: 'Falha ao processar QR Code' } });
      } finally {
        setLoadingRead(false);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [navigate]);

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
      >
        Voltar
      </Button>

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
      >
        {error && (
          <Flex height="100%" align="center" justify="center">
            <Text color="red.300">{error}</Text>
          </Flex>
        )}
      </Box>

      <Text mt={4} textAlign="center">
        Aponte a câmera para o QR Code do cupom fiscal
      </Text>
    </Flex>
  );
};
