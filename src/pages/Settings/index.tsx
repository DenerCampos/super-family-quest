import { useCallback, useEffect, useState } from 'react';
import { Text, useToast } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { PageScaffold } from '../../components/PageScaffold';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services';
import type { IntegrationsStatus } from '../../services/integrations';
import { AlexaIntegrationCard } from './AlexaIntegrationCard';
import { HowToConnectCard } from './HowToConnectCard';

const Settings = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { isDemo } = useAuth();
  const toast = useToast();
  const location = useLocation();

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
    if (isDemo) {
      toast({
        title: t('profile.demoReadOnly'),
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
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
    <PageScaffold
      title={t('settings.title')}
      backTo="/new-resources"
      bg={getColor('background.settings')}
      contentLayout="plain"
    >
      <Text
        color={getColor('text.dashboard.tileSubtitle')}
        fontSize="sm"
        textAlign="center"
        mb={6}
      >
        {t('settings.subtitle')}
      </Text>

      {isDemo && (
        <Text
          color={getColor('text.dashboard.tileSubtitle')}
          fontSize="sm"
          textAlign="center"
          mb={4}
        >
          {t('profile.demoReadOnly')}
        </Text>
      )}

      <AlexaIntegrationCard
        connected={alexaConnected}
        loading={loadingStatus}
        loadingDisconnect={loadingDisconnect}
        onDisconnect={handleDisconnect}
        disconnectDisabled={isDemo}
      />

      {!loadingStatus && !alexaConnected && !isDemo && <HowToConnectCard />}
    </PageScaffold>
  );
};

export default Settings;
