import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { ThemedSelect } from '../ThemedSelect';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { RecurrenceForm } from '../../types/financial';

const defaultRecurrence: RecurrenceForm = {
  enabled: false,
  mode: 'none',
  count: 2,
  intervalUnit: 'months',
  intervalValue: 1,
  dueDay: 10,
};

export const RecurrenceStep = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { watch, setValue, getValues } = useFormContext<{ recurrence: RecurrenceForm }>();

  const recurrence = watch('recurrence') ?? defaultRecurrence;

  const readRecurrence = (): RecurrenceForm =>
    getValues('recurrence') ?? defaultRecurrence;

  const inputStyle = {
    bg: getColor('input.background'),
    color: getColor('text.primary'),
    borderColor: getColor('input.border'),
    _focus: {
      borderColor: getColor('input.focus'),
      boxShadow: `0 0 0 1px ${getColor('input.focusBorder')}`,
    },
  };

  const clampOnBlur = (
    field: 'count' | 'intervalValue' | 'dueDay',
    min: number,
    max: number,
    fallback: number,
  ) => {
    const current = readRecurrence();
    let value = current[field];
    if (value == null || Number.isNaN(value)) value = fallback;
    value = Math.min(max, Math.max(min, value));
    setValue('recurrence', { ...current, [field]: value }, { shouldDirty: true });
  };

  const handleNumericChange = (
    field: 'count' | 'intervalValue' | 'dueDay',
    raw: string,
  ) => {
    const digits = raw.replace(/\D/g, '');
    const current = readRecurrence();

    if (digits === '') {
      setValue(
        'recurrence',
        { ...current, [field]: undefined },
        { shouldDirty: true },
      );
      return;
    }

    const n = Number(digits);
    if (!Number.isNaN(n)) {
      setValue(
        'recurrence',
        { ...current, [field]: n },
        { shouldDirty: true },
      );
    }
  };

  const numericDisplay = (value: number | undefined): string =>
    value == null || Number.isNaN(value) ? '' : String(value);

  return (
    <VStack align="stretch" spacing={4}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="recurrence-enabled" mb={0} color={getColor('text.primary')}>
          {t('financialSteps.recurrence.enable')}
        </FormLabel>
        <Switch
          id="recurrence-enabled"
          isChecked={recurrence.enabled}
          onChange={(e) => {
            const current = readRecurrence();
            setValue('recurrence', {
              ...defaultRecurrence,
              ...current,
              enabled: e.target.checked,
              mode: e.target.checked ? 'installment_finite' : 'none',
            });
          }}
        />
      </FormControl>

      {recurrence.enabled && (
        <>
          <FormControl>
            <FormLabel color={getColor('text.primary')}>
              {t('financialSteps.recurrence.mode')}
            </FormLabel>
            <ThemedSelect
              value={recurrence.mode}
              onChange={(mode) => {
                const current = readRecurrence();
                setValue('recurrence', {
                  ...current,
                  mode: mode as RecurrenceForm['mode'],
                });
              }}
              options={[
                {
                  value: 'installment_finite',
                  label: t('financialSteps.recurrence.finite'),
                },
                {
                  value: 'installment_infinite',
                  label: t('financialSteps.recurrence.infinite'),
                },
                {
                  value: 'fixed_repeat',
                  label: t('financialSteps.recurrence.fixed'),
                },
              ]}
            />
          </FormControl>

          {recurrence.mode === 'installment_finite' && (
            <FormControl>
              <FormLabel color={getColor('text.primary')}>
                {t('financialSteps.recurrence.count')}
              </FormLabel>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                {...inputStyle}
                value={numericDisplay(recurrence.count)}
                onChange={(e) => handleNumericChange('count', e.target.value)}
                onBlur={() => clampOnBlur('count', 2, 120, 2)}
              />
            </FormControl>
          )}

          {recurrence.mode !== 'fixed_repeat' && (
            <>
              <Text fontSize="sm" color={getColor('text.muted')}>
                {t('financialSteps.recurrence.intervalHint')}
              </Text>

              <Flex
                gap={4}
                align="flex-end"
                direction={{ base: 'column', sm: 'row' }}
              >
                <FormControl
                  flex={1}
                  w={
                    recurrence.intervalUnit === 'months'
                      ? { base: 'full', sm: '50%' }
                      : 'full'
                  }
                >
                  <FormLabel color={getColor('text.primary')}>
                    {t('financialSteps.recurrence.interval')}
                  </FormLabel>
                  <Flex gap={2}>
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      flex={1}
                      {...inputStyle}
                      value={numericDisplay(recurrence.intervalValue)}
                      onChange={(e) =>
                        handleNumericChange('intervalValue', e.target.value)
                      }
                      onBlur={() => clampOnBlur('intervalValue', 1, 999, 1)}
                    />
                    <Box flex={1}>
                      <ThemedSelect
                        value={recurrence.intervalUnit}
                        onChange={(intervalUnit) => {
                          const current = readRecurrence();
                          setValue('recurrence', {
                            ...current,
                            intervalUnit:
                              intervalUnit as RecurrenceForm['intervalUnit'],
                          });
                        }}
                        options={[
                          {
                            value: 'days',
                            label: t('financialSteps.recurrence.days'),
                          },
                          {
                            value: 'months',
                            label: t('financialSteps.recurrence.months'),
                          },
                          {
                            value: 'years',
                            label: t('financialSteps.recurrence.years'),
                          },
                        ]}
                      />
                    </Box>
                  </Flex>
                </FormControl>

                {recurrence.intervalUnit === 'months' && (
                  <FormControl flex={1} w={{ base: 'full', sm: '50%' }}>
                    <FormLabel color={getColor('text.primary')}>
                      {t('financialSteps.recurrence.dueDay')}
                    </FormLabel>
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      {...inputStyle}
                      value={numericDisplay(recurrence.dueDay)}
                      onChange={(e) =>
                        handleNumericChange('dueDay', e.target.value)
                      }
                      onBlur={() => clampOnBlur('dueDay', 1, 31, 10)}
                    />
                  </FormControl>
                )}
              </Flex>
            </>
          )}
        </>
      )}
    </VStack>
  );
};
