import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Flex, Text, IconButton, useToast } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import type { IntegrationsStatus } from '../../services/integrations';
import { AlexaIntegrationCard } from './AlexaIntegrationCard';
import { HowToConnectCard } from './HowToConnectCard';

const Settings = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [integrations, setIntegrations] = useState<IntegrationsStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingDisconnect, setLoadingDisconnect] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const data = await api.getIntegrationsStatus();
      setIntegrations(data);
    } catch {
      toast({
        title: t('settings.integrations.feedback.loadError'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingStatus(false);
    }
  }, [toast, t]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasOAuthReturn = params.has('code') || params.has('state') || params.has('success');
    if (hasOAuthReturn) {
      loadStatus();
    }
  }, [location.search, loadStatus]);

  const handleDisconnect = async () => {
    try {
      setLoadingDisconnect(true);
      await api.unlinkAlexa();
      await loadStatus();
      toast({
        title: t('settings.integrations.feedback.disconnectedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: t('settings.integrations.feedback.disconnectError'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingDisconnect(false);
    }
  };

  const alexaConnected = integrations?.alexa?.connected ?? false;

  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="flex-start"
        pt={6}
        pb={20}
        px={4}
        bg={getColor('background.settings')}
      >
        <Box width="100%" maxW="600px">
          <Flex align="center" gap={3} mb={1}>
            <IconButton
              aria-label={t('common.back')}
              icon={<FiArrowLeft />}
              variant="ghost"
              color={getColor('text.dashboard.title')}
              onClick={() => navigate('/new-resources')}
              size="sm"
            />
            <Text
              fontSize="xl"
              fontWeight="bold"
              fontFamily={getFont('heading')}
              color={getColor('text.dashboard.title')}
            >
              {t('settings.title')}
            </Text>
          </Flex>

          <Text
            color={getColor('text.dashboard.tileSubtitle')}
            fontSize="sm"
            textAlign="center"
            mb={6}
            pl={10}
          >
            {t('settings.subtitle')}
          </Text>

          <AlexaIntegrationCard
            connected={alexaConnected}
            loading={loadingStatus}
            loadingDisconnect={loadingDisconnect}
            onDisconnect={handleDisconnect}
          />

          {!loadingStatus && !alexaConnected && <HowToConnectCard />}
        </Box>
      </Flex>

      <NavigationBar />
    </Flex>
  );
};

export default Settings;
