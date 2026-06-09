import { useCallback, useMemo, useState } from 'react';
import type { IconType } from 'react-icons';

export type StepState = 'locked' | 'available' | 'done' | 'skipped';

export type StepConfig = {
  id: string;
  label: string;
  optional?: boolean;
  icon: IconType;
};

export function useFormStepper(steps: StepConfig[], canUnlock: boolean) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});

  const stepStates = useMemo(() => {
    return steps.map((step, index) => {
      if (index === 0) {
        return canUnlock ? 'available' : 'available';
      }
      if (!canUnlock) return 'locked' as StepState;
      if (completed[step.id]) return 'done' as StepState;
      if (skipped[step.id]) return 'skipped' as StepState;
      return 'available' as StepState;
    });
  }, [steps, canUnlock, completed, skipped]);

  const goTo = useCallback(
    (index: number) => {
      if (index === 0 || (canUnlock && stepStates[index] !== 'locked')) {
        setActiveIndex(index);
      }
    },
    [canUnlock, stepStates],
  );

  const next = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

  const markDone = useCallback((id: string) => {
    setCompleted((c) => ({ ...c, [id]: true }));
  }, []);

  const markSkipped = useCallback((id: string) => {
    setSkipped((s) => ({ ...s, [id]: true }));
  }, []);

  return {
    activeIndex,
    stepStates,
    goTo,
    next,
    prev,
    markDone,
    markSkipped,
    setActiveIndex,
  };
}
