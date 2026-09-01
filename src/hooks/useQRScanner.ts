import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import { api } from '../services';
import { convertQRData } from '../utils/qrCode';
import { useThemedTranslation } from './useThemedTranslation';
import { resolveAiErrorMessage } from '../utils/aiProviderError';

export const useQRScanner = () => {
  const { t } = useThemedTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState('');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  const navigate = useNavigate();
  const controlsRef = useRef<IScannerControls | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false);

  const stopCamera = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (err) {
        console.warn('Erro ao parar controles:', err);
      }
      controlsRef.current = null;
    }

    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn('Erro ao parar tracks:', err);
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (err) {
        console.warn('Erro ao limpar vídeo:', err);
      }
    }
  }, []);

  const handleBack = useCallback(() => {
    stopCamera();
    navigate('/home');
  }, [stopCamera, navigate]);

  const handleQRCodeScanned = useCallback(
    async (qrData: string) => {
      if (!isMountedRef.current) return;

      try {
        setLoadingRead(true);
        stopCamera();

        const data = await api.couponReader({ url: qrData });

        if (isMountedRef.current) {
          navigate('/expense', {
            state: {
              couponData: convertQRData(data),
              scanned: true,
            },
          });
        }
      } catch (err) {
        console.error('Erro ao processar QR Code:', err);
        if (isMountedRef.current) {
          setError(
            resolveAiErrorMessage(
              err,
              t,
              'qrScannerPage.errors.processingFailed',
            ),
          );
        }
      } finally {
        if (isMountedRef.current) {
          setLoadingRead(false);
        }
      }
    },
    [stopCamera, navigate, t],
  );

  const createVideoElement = (container: HTMLElement): HTMLVideoElement => {
    const videoElem = document.createElement('video');
    videoElem.style.width = '100%';
    videoElem.style.height = '100%';
    videoElem.style.objectFit = 'cover';
    videoElem.setAttribute('playsinline', 'true');
    videoElem.setAttribute('autoplay', 'true');
    videoElem.setAttribute('muted', 'true');
    container.innerHTML = '';
    container.appendChild(videoElem);
    return videoElem;
  };

  const initMediaStream = async (
    deviceId: string,
    facingMode: string,
  ): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId }, facingMode },
    });
  };

  const waitForVideoLoad = useCallback((videoEl: HTMLVideoElement): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(t('qrScannerPage.errors.videoTimeout')));
      }, 5000);

      videoEl.onloadedmetadata = () => {
        clearTimeout(timeout);
        resolve();
      };

      videoEl.onerror = (err) => {
        clearTimeout(timeout);
        reject(err);
      };
    });
  }, [t]);

  const attachQRReader = async (
    deviceId: string,
    videoEl: HTMLVideoElement,
    onScanned: (text: string) => void,
  ): Promise<IScannerControls> => {
    const codeReader = new BrowserQRCodeReader();
    return codeReader.decodeFromVideoDevice(deviceId, videoEl, (result) => {
      if (result && isMountedRef.current) {
        onScanned(result.getText());
      }
    });
  };

  const startScanner = useCallback(
    async (deviceId: string, deviceIndex: number) => {
      if (!isMountedRef.current || isInitializingRef.current) return;

      isInitializingRef.current = true;
      setLoading(true);

      try {
        const scannerContainer = document.getElementById('scanner-container');

        if (!scannerContainer) {
          setError(t('qrScannerPage.errors.scannerNotFound'));
          setLoading(false);
          return;
        }

        if (!videoRef.current) {
          videoRef.current = createVideoElement(scannerContainer);
        }

        const facingMode = deviceIndex === 0 ? 'environment' : 'user';
        const mediaStream = await initMediaStream(deviceId, facingMode);

        if (!isMountedRef.current) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        videoRef.current.srcObject = mediaStream;

        await waitForVideoLoad(videoRef.current);

        controlsRef.current = await attachQRReader(
          deviceId,
          videoRef.current,
          handleQRCodeScanned,
        );

        setError('');
      } catch (err) {
        console.error('Erro ao iniciar scanner:', err);
        if (isMountedRef.current) {
          setError(
            t('qrScannerPage.errors.cameraAccess', {
              message:
                err instanceof Error
                  ? err.message
                  : t('qrScannerPage.errors.unknown'),
            }),
          );
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          isInitializingRef.current = false;
        }
      }
    },
    [handleQRCodeScanned, t, waitForVideoLoad],
  );

  const switchCamera = useCallback(() => {
    if (availableDevices.length <= 1 || isInitializingRef.current) return;

    stopCamera();
    const nextIndex = (currentDeviceIndex + 1) % availableDevices.length;
    setCurrentDeviceIndex(nextIndex);

    setTimeout(() => {
      if (isMountedRef.current) {
        startScanner(availableDevices[nextIndex].deviceId, nextIndex);
      }
    }, 300);
  }, [availableDevices, currentDeviceIndex, stopCamera, startScanner]);

  useEffect(() => {
    isMountedRef.current = true;

    const initializeCamera = async () => {
      setLoading(true);

      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();

        if (!isMountedRef.current) return;

        if (devices.length === 0) {
          setError(t('qrScannerPage.errors.noCamera'));
          setLoading(false);
          return;
        }

        setAvailableDevices(devices);

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

        setCurrentDeviceIndex(preferredIndex);
        await startScanner(devices[preferredIndex].deviceId, preferredIndex);
      } catch (err) {
        console.error('Erro na inicialização:', err);
        if (isMountedRef.current) {
          setError(
            t('qrScannerPage.errors.initFailed', {
              message:
                err instanceof Error
                  ? err.message
                  : t('qrScannerPage.errors.unknown'),
            }),
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

  return {
    loading,
    loadingRead,
    error,
    availableDevices,
    currentDeviceIndex,
    isInitializingRef,
    handleBack,
    switchCamera,
  };
};
