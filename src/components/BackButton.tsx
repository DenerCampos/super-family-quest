import { IconButton } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';

type BackButtonProps = {
  to?: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
};

export const BackButton = ({ to, onClick, size = 'md' }: BackButtonProps) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (to) {
      navigate(to);
    }
  };

  return (
    <IconButton
      icon={<FiArrowLeft />}
      size={size}
      aria-label={t('common.back')}
      borderRadius="full"
      flexShrink={0}
      color={getColor('text.dashboard.title')}
      bg={getColor('background.dashboard.tileActive')}
      border="1px solid"
      borderColor={getColor('border.dashboard.tile')}
      _hover={{
        bg: getColor('border.dashboard.tileActive'),
        color: getColor('text.primary'),
      }}
      onClick={handleClick}
    />
  );
};
