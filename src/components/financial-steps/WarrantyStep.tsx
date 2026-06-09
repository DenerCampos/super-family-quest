import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { ThemedSelect } from '../ThemedSelect';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { IntervalUnit } from '../../types/financial';
import type { Expense } from '../../services/resources';
import { formatCurrencyBRL, parseBRLCurrency } from '../../utils/formatCurrency';
import { parseGrams } from '../../utils/formatGrams';

function getItemLineTotal(item: Expense['items'][number]): number {
  if (item.total != null && item.total > 0) {
    return item.total;
  }

  const unitValue = parseBRLCurrency(item.value);
  const quantity = parseGrams(item.quantity);
  return Number((unitValue * quantity).toFixed(2));
}

export const WarrantyStep = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { watch, setValue, getValues } = useFormContext<Expense>();

  const items = watch('items') ?? [];

  const updateItemWarranty = (
    index: number,
    patch: { warrantyDuration?: number; warrantyUnit?: IntervalUnit | '' },
  ) => {
    const currentItems = getValues('items') ?? [];
    const item = currentItems[index];
    if (!item) return;

    const nextDuration =
      patch.warrantyDuration !== undefined
        ? patch.warrantyDuration
        : (item.warrantyDuration ?? 0);

    const nextUnit =
      patch.warrantyUnit !== undefined
        ? patch.warrantyUnit || null
        : (item.warrantyUnit ?? null);

    setValue(
      `items.${index}`,
      {
        ...item,
        warrantyDuration: nextDuration,
        warrantyUnit: nextUnit,
        warrantyExpiresAt: null,
      },
      { shouldDirty: true },
    );
  };

  const inputFieldStyle = {
    bg: getColor('input.background'),
    color: getColor('text.primary'),
    borderColor: getColor('input.border'),
    _focus: {
      borderColor: getColor('input.focus'),
      boxShadow: `0 0 0 1px ${getColor('input.focusBorder')}`,
    },
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="sm" color={getColor('text.muted')}>
        {t('financialSteps.warranty.hint')}
      </Text>
      {items.map((item, index) => {
        const duration = item.warrantyDuration ?? 0;
        const unit = (item.warrantyUnit ?? '') as IntervalUnit | '';
        const lineTotal = getItemLineTotal(item);

        return (
          <Box
            key={item.id ?? `warranty-row-${index}`}
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor={getColor('border.tertiary')}
          >
            <Flex
              justify="space-between"
              align="center"
              gap={3}
              mb={3}
              minH="24px"
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={getColor('text.primary')}
                noOfLines={1}
                flex={1}
                minW={0}
              >
                {item.name || t('financialSteps.warranty.unnamedItem')}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={getColor('text.muted')}
                flexShrink={0}
              >
                R$ {formatCurrencyBRL(lineTotal)}
              </Text>
            </Flex>

            <Grid templateColumns="72px 1fr" gap={3} alignItems="end">
              <FormControl>
                <FormLabel fontSize="xs" mb={1} color={getColor('text.primary')}>
                  {t('financialSteps.warranty.duration')}
                </FormLabel>
                <NumberInput
                  min={0}
                  value={duration}
                  onChange={(_, n) =>
                    updateItemWarranty(index, {
                      warrantyDuration: Number.isNaN(n) ? 0 : n,
                    })
                  }
                >
                  <NumberInputField {...inputFieldStyle} />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" mb={1} color={getColor('text.primary')}>
                  {t('financialSteps.warranty.unit')}
                </FormLabel>
                <ThemedSelect
                  value={unit}
                  onChange={(nextUnit) =>
                    updateItemWarranty(index, {
                      warrantyUnit: nextUnit as IntervalUnit | '',
                    })
                  }
                  options={[
                    { value: '', label: t('common.none') },
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
              </FormControl>
            </Grid>
          </Box>
        );
      })}
    </VStack>
  );
};
