import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import { FiChevronsRight } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { StepState } from './useFormStepper';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const isDragging = useRef(false);

  const handleScrollEnd = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !swipeEnabled) return;

    const width = el.clientWidth;
    if (width <= 0) return;

    const rawIndex = Math.round(el.scrollLeft / width);
    const clamped = Math.max(0, Math.min(rawIndex, panels.length - 1));

    if (stepStates[clamped] === 'locked') {
      el.scrollTo({ left: activeIndex * width, behavior: 'smooth' });
      return;
    }

    if (clamped !== activeIndex) {
      onStepChange(clamped);
    }
  }, [activeIndex, onStepChange, panels.length, stepStates, swipeEnabled]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isDragging.current) return;
    const width = el.clientWidth;
    if (width <= 0) return;
    el.scrollTo({ left: activeIndex * width, behavior: 'smooth' });
  }, [activeIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      isDragging.current = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        isDragging.current = false;
        handleScrollEnd();
      }, 150);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', onScroll);
    };
  }, [handleScrollEnd]);

  return (
    <Flex direction="column" flex="1" minH={0} overflow="hidden">
      {swipeEnabled && panels.length > 1 && (
        <Flex
          align="center"
          gap={2}
          mb={2}
          color={getColor('text.muted')}
          flexShrink={0}
        >
          <Icon as={FiChevronsRight} boxSize={4} aria-hidden />
          <Text fontSize="xs">{t('financialSteps.nav.swipeHint')}</Text>
        </Flex>
      )}

      <Box
        ref={scrollRef}
        flex="1"
        minH={0}
        overflowX={swipeEnabled ? 'auto' : 'hidden'}
        overflowY="hidden"
        sx={{
          scrollSnapType: swipeEnabled ? 'x mandatory' : 'none',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Flex h="full" w={`${panels.length * 100}%`}>
          {panels.map((panel, index) => (
            <Box
              key={index}
              flex={`0 0 ${100 / panels.length}%`}
              w={`${100 / panels.length}%`}
              h="full"
              overflowY="auto"
              overflowX="hidden"
              px={1}
              pb={2}
              scrollSnapAlign="start"
              sx={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {panel}
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};
