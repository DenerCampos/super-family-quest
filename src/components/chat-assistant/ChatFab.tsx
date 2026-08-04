import { Box } from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import type { PointerEvent } from 'react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { resolveChakraColor } from '../../utils/resolveColor';

type ChatFabProps = {
  size: number;
  right: number;
  bottom: number;
  zIndex: number;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
};

export function ChatFab({
  size,
  right,
  bottom,
  zIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: ChatFabProps) {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const bg = resolveChakraColor(getColor('button.background.primary'));
  const color = resolveChakraColor(getColor('button.text.primary'));

  return (
    <Box
      pointerEvents="auto"
      position="absolute"
      zIndex={zIndex}
      right={`${right}px`}
      bottom={`${bottom}px`}
      w={`${size}px`}
      h={`${size}px`}
      borderRadius="full"
      bg={bg}
      color={color}
      boxShadow="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="grab"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      aria-label={t('chatAssistant.openAria')}
      role="button"
    >
      <Box as={FiMessageCircle} boxSize={5} pointerEvents="none" />
    </Box>
  );
}
