import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import { Flex, Heading, Text, Box, Button } from '@chakra-ui/react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { FiArrowLeft } from 'react-icons/fi';
import { api } from '../services';

export const QRScannerPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let controls: IScannerControls | null;
    let stream: MediaStream | null;

    const startScanner = async () => {
      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();

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

        // Criar elemento de vídeo
        const videoElem = document.createElement('video');
        videoElem.style.width = '100%';
        videoElem.style.height = '100%';
        scannerContainer.appendChild(videoElem);

        // Iniciar stream
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: deviceId },
            facingMode: 'environment',
          },
        });

        stream = mediaStream;
        videoElem.srcObject = mediaStream;
        await videoElem.play();

        // Iniciar leitor
        controls = await codeReader.decodeFromVideoDevice(
          deviceId,
          videoElem,
          (result) => {
            if (result && isScanning) {
              // Verificar estado de scanning
              setIsScanning(false);
              handleQRCodeScanned(result.getText());
            }
          },
        );

        setLoading(false);
      } catch (err) {
        console.error('Erro:', err);
        setError('Não foi possível acessar a câmera');
        setLoading(false);
      }
    };

    const handleQRCodeScanned = async (qrData: string) => {
      try {
        setLoadingRead(true);
        // Parar scanner primeiro
        if (controls) {
          controls.stop();
          controls = null;
        }

        // Parar stream de mídia
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          stream = null;
        }

        console.log('QR Code lido:', qrData);
        const data = await api.couponReader.read({ code: qrData });
        console.log('data', data);

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
      if (controls) {
        controls.stop();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsScanning(false);
    };
  }, [navigate, isScanning]);

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
      {loading && <LoadingOverlay text="Carregando camera" typeLoading="open" />}

      {loadingRead && <LoadingOverlay text="Lendo cupom fiscal" typeLoading="read" />}

      <Button
        position="absolute"
        top="4"
        left="4"
        onClick={() => navigate('/home')}
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
