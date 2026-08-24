import { IconButton } from '@chakra-ui/react';
import { FiShare2 } from 'react-icons/fi';
import { useShareText } from '../hooks/useShareText';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';
import type { ShareTextPayload } from '../utils/nativeShare';

type Props = {
  payload: ShareTextPayload;
  isDisabled?: boolean;
  color?: string;
};

export function ShareTextButton({ payload, isDisabled, color }: Props) {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { shareText, isSharing } = useShareText();

  return (
    <IconButton
      aria-label={t('share.button')}
      icon={<FiShare2 />}
      size="sm"
      variant="ghost"
      color={color ?? getColor('text.dashboard.title')}
      _hover={{ bg: getColor('background.secondary') }}
      isDisabled={isDisabled || !payload.text}
      isLoading={isSharing}
      onClick={() => void shareText(payload)}
    />
  );
}
