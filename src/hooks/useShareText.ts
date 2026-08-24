import { useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useThemedTranslation } from './useThemedTranslation';
import {
  shareOrCopyText,
  type ShareTextPayload,
} from '../utils/nativeShare';

export function useShareText() {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const [isSharing, setIsSharing] = useState(false);

  const shareText = useCallback(
    async (payload: ShareTextPayload) => {
      setIsSharing(true);
      try {
        const result = await shareOrCopyText(payload);

        if (result === 'copied') {
          toast({
            title: t('share.copied'),
            status: 'success',
            duration: 2500,
          });
          return;
        }

        if (result === 'failed') {
          toast({
            title: t('share.failed'),
            status: 'error',
            duration: 4000,
          });
        }
      } finally {
        setIsSharing(false);
      }
    },
    [t, toast],
  );

  return { shareText, isSharing };
}
