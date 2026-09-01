import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import {
  AI_PROVIDER_ERROR_EVENT,
  AI_PROVIDER_TOAST_ID,
  AI_QUOTA_ERROR_EVENT,
  AI_QUOTA_TOAST_ID,
} from '../utils/aiProviderError';

export function AiErrorToastListener() {
  const toast = useToast();
  const { t } = useThemedTranslation();

  useEffect(() => {
    const onProviderError = () => {
      toast({
        id: AI_PROVIDER_TOAST_ID,
        title: t('common.aiProviderError'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    };

    const onQuotaError = () => {
      toast({
        id: AI_QUOTA_TOAST_ID,
        title: t('common.aiQuotaError'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    };

    window.addEventListener(AI_PROVIDER_ERROR_EVENT, onProviderError);
    window.addEventListener(AI_QUOTA_ERROR_EVENT, onQuotaError);
    return () => {
      window.removeEventListener(AI_PROVIDER_ERROR_EVENT, onProviderError);
      window.removeEventListener(AI_QUOTA_ERROR_EVENT, onQuotaError);
    };
  }, [t, toast]);

  return null;
}
