import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex, Heading, Text, Box, Button, VStack, IconButton, HStack } from '@chakra-ui/react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { FiArrowLeft, FiMic, FiSquare, FiSend, FiPlay, FiPause } from 'react-icons/fi';
import { api } from '../services';
import { convertQRData } from '../utils/qrCode';
import { useThemeTranslation } from '../hooks/useThemeTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { resolveAiErrorMessage } from '../utils/aiProviderError';

export const AudioRecognitionPage = () => {
  const { getColor, getFont } = useVisualTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useThemeTranslation();

  // Determinar se é para expense ou revenue baseado na navegação
  const isRevenue = location.state?.from === 'revenue';
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const handleBack = () => {
    if (isRecording) {
      stopRecording();
    }
    navigate('/home');
  };

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!isMountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setHasRecording(true);
        
        // Criar URL do áudio para reprodução
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Parar todos os tracks de áudio
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      if (isMountedRef.current) {
        setError(t('audioRecognitionPage.microphoneError'));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;

    try {
      setLoading(true);
      setError('');

      const audioFile = new File([audioBlob], 'gravacao.webm', { type: 'audio/webm' });
      let couponData;
      if (isRevenue) {
        const data = await api.revenueAnalyzeAudio(audioFile);
        couponData = data;
        navigate('/revenue', {
          state: {
            couponData,
            scanned: true,
          },
        });
      } else {
        const data = await api.expenseAnalyzeAudio(audioFile);
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
            'audioRecognitionPage.processingError',
          ),
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    // Parar áudio se estiver tocando
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Liberar URL do áudio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    setAudioBlob(null);
    setHasRecording(false);
    setRecordingTime(0);
    setError('');
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      stopTimer();
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      // Limpar URL do áudio ao desmontar
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      bg={getColor('background.primary')}
      color={getColor('text.primary')}
      p={4}
    >
      {loading && (
        <LoadingOverlay text={t('audioRecognitionPage.analyzingAudio')} typeLoading="read" />
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
        {t('audioRecognitionPage.back')}
      </Button>

      <VStack spacing={6} maxWidth="600px" width="100%">
        <Heading
          color={getColor('text.primary')}
          fontFamily={getFont('heading')}
          textAlign="center"
        >
          {t('audioRecognitionPage.title')}
        </Heading>

        <Box
          width="100%"
          minHeight="300px"
          border="2px solid"
          borderColor={getColor('border.primary')}
          borderRadius="md"
          p={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bg={getColor('background.secondary')}
        >
          {error && (
            <Text color={getColor('status.error')} textAlign="center" mb={4}>
              {error}
            </Text>
          )}

          {isRecording && (
            <VStack spacing={4}>
              <Box
                width="80px"
                height="80px"
                borderRadius="full"
                bg={getColor('status.error')}
                display="flex"
                alignItems="center"
                justifyContent="center"
                animation="pulse 1.5s infinite"
                sx={{
                  '@keyframes pulse': {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.7, transform: 'scale(1.05)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                  },
                }}
              >
                <FiMic size={40} color="white" />
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
              >
                {t('audioRecognitionPage.recording')}
              </Text>
              <Text
                fontSize="lg"
                color={getColor('text.secondary')}
                fontFamily={getFont('body')}
              >
                {t('audioRecognitionPage.recordingTime', { time: recordingTime })}
              </Text>
            </VStack>
          )}

          {!isRecording && !hasRecording && (
            <VStack spacing={4}>
              <Box
                width="80px"
                height="80px"
                borderRadius="full"
                bg={getColor('background.tertiary')}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiMic size={40} color={getColor('text.primary')} />
              </Box>
              <Text
                textAlign="center"
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
              >
                {t('audioRecognitionPage.instructions')}
              </Text>
              <Text
                fontSize="sm"
                textAlign="center"
                color={getColor('text.secondary')}
                fontFamily={getFont('body')}
                mt={2}
              >
                {t('audioRecognitionPage.instructionsDetail')}
              </Text>
            </VStack>
          )}

          {!isRecording && hasRecording && (
            <VStack spacing={4} width="100%">
              <Box
                width="80px"
                height="80px"
                borderRadius="full"
                bg={getColor('status.success')}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiMic size={40} color="white" />
              </Box>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
              >
                {t('audioRecognitionPage.recordingComplete')}
              </Text>
              <Text
                color={getColor('text.secondary')}
                fontFamily={getFont('body')}
              >
                {t('audioRecognitionPage.recordingTime', { time: recordingTime })}
              </Text>

              {/* Player de áudio */}
              {audioUrl && (
                <VStack spacing={3} width="100%" mt={4}>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    style={{ display: 'none' }}
                  />
                  
                  <HStack spacing={3} width="100%" justifyContent="center">
                    <IconButton
                      aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
                      icon={isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                      onClick={togglePlayPause}
                      size="lg"
                      borderRadius="full"
                      bg={getColor('button.background.primary')}
                      color={getColor('button.text.primary')}
                      border="2px solid"
                      borderColor={getColor('button.border.neutral')}
                      _hover={{
                        bg: getColor('button.hover.background.default'),
                        color: getColor('button.hover.text.default'),
                        borderColor: getColor('button.hover.border.default'),
                      }}
                    />
                  </HStack>

                  <Text
                    fontSize="sm"
                    color={getColor('text.secondary')}
                    fontFamily={getFont('body')}
                  >
                    {isPlaying ? t('audioRecognitionPage.playing') : t('audioRecognitionPage.playAudio')}
                  </Text>
                </VStack>
              )}
            </VStack>
          )}
        </Box>

        <VStack spacing={3} width="100%">
          {!isRecording && !hasRecording && (
            <Button
              size="lg"
              width="100%"
              leftIcon={<FiMic />}
              onClick={startRecording}
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
              {t('audioRecognitionPage.startRecording')}
            </Button>
          )}

          {isRecording && (
            <Button
              size="lg"
              width="100%"
              leftIcon={<FiSquare />}
              onClick={stopRecording}
              bg={getColor('status.error')}
              color="white"
              border="1px solid"
              borderColor={getColor('status.error')}
              _hover={{
                opacity: 0.8,
              }}
              fontFamily={getFont('body')}
            >
              {t('audioRecognitionPage.stopRecording')}
            </Button>
          )}

          {!isRecording && hasRecording && (
            <>
              <Button
                size="lg"
                width="100%"
                leftIcon={<FiSend />}
                onClick={handleSendAudio}
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
                isLoading={loading}
              >
                {t('audioRecognitionPage.sendAudio')}
              </Button>
              <Button
                size="lg"
                width="100%"
                variant="outline"
                onClick={handleCancel}
                color={getColor('text.primary')}
                borderColor={getColor('border.primary')}
                _hover={{
                  bg: getColor('background.selected'),
                }}
                fontFamily={getFont('body')}
              >
                {t('audioRecognitionPage.cancel')}
              </Button>
            </>
          )}
        </VStack>
      </VStack>
    </Flex>
  );
};

