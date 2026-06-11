import { Box, Flex } from '@chakra-ui/react';
import { useCallback, useRef } from 'react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { StepState } from './useFormStepper';

const SWIPE_THRESHOLD_PX = 48;

type Props = {
  activeIndex: number;
  onStepChange: (index: number) => void;
  stepStates: StepState[];
  swipeEnabled: boolean;
  panels: React.ReactNode[];
};

export const StepSwipePanels = ({
  activeIndex,
  onStepChange,
  stepStates,
  swipeEnabled,
  panels,
}: Props) => {
  const { getColor } = useVisualTheme();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const tryChangeStep = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= panels.length) return;
      if (nextIndex > 0 && stepStates[nextIndex] === 'locked') return;
      onStepChange(nextIndex);
    },
    [onStepChange, panels.length, stepStates],
  );

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!swipeEnabled) return;
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!swipeEnabled || !touchStart.current) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) <= Math.abs(dy)) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;

    if (dx < 0) {
      tryChangeStep(activeIndex + 1);
    } else {
      tryChangeStep(activeIndex - 1);
    }
  };

  const panel = panels[activeIndex] ?? null;

  return (
    <Flex direction="column" flex="1" minH={0} overflow="hidden">
      <Box
        key={activeIndex}
        flex="1"
        minH={0}
        overflowY="auto"
        overflowX="hidden"
        bg={getColor('background.primary')}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        sx={{ WebkitOverflowScrolling: 'touch' }}
      >
        {panel}
      </Box>
    </Flex>
  );
};
