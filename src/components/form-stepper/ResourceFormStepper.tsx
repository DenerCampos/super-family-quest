import { Flex, Icon, Text } from '@chakra-ui/react';
import { FiCheck, FiLock } from 'react-icons/fi';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { StepConfig, StepState } from './useFormStepper';

type Props = {
  steps: StepConfig[];
  activeIndex: number;
  stepStates: StepState[];
  onStepClick: (index: number) => void;
};

export const ResourceFormStepper = ({
  steps,
  activeIndex,
  stepStates,
  onStepClick,
}: Props) => {
  const { getColor } = useVisualTheme();

  return (
    <Flex
      mb={4}
      gap={1}
      overflowX="auto"
      pb={1}
      sx={{
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {steps.map((step, index) => {
        const state = stepStates[index];
        const isActive = index === activeIndex;
        const locked = state === 'locked';
        const StepIcon = step.icon;

        return (
          <Flex
            key={step.id}
            direction="column"
            align="center"
            flex="1"
            minW="72px"
            cursor={locked ? 'not-allowed' : 'pointer'}
            opacity={locked ? 0.45 : 1}
            onClick={() => !locked && onStepClick(index)}
          >
            <Flex
              w="36px"
              h="36px"
              borderRadius="full"
              align="center"
              justify="center"
              border="2px solid"
              borderColor={
                isActive
                  ? getColor('text.accent')
                  : getColor('border.primary')
              }
              bg={
                state === 'done'
                  ? getColor('background.selected')
                  : getColor('background.secondary')
              }
            >
              {locked ? (
                <Icon as={FiLock} boxSize={3.5} color={getColor('text.muted')} />
              ) : state === 'done' ? (
                <Icon as={FiCheck} boxSize={4} color={getColor('text.accent')} />
              ) : (
                <Icon
                  as={StepIcon}
                  boxSize={4}
                  color={
                    isActive
                      ? getColor('text.accent')
                      : getColor('text.primary')
                  }
                />
              )}
            </Flex>
            <Text
              fontSize="2xs"
              mt={1}
              textAlign="center"
              fontWeight={isActive ? 'bold' : 'normal'}
              color={getColor('text.primary')}
              noOfLines={2}
            >
              {step.label}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
