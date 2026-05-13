import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';

type MonthYearInputProps = {
  year: number;
  month: number;
  onChange: (next: { year: number; month: number }) => void;
};

export const MonthYearInput = ({
  year,
  month,
  onChange,
}: MonthYearInputProps) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const value = `${year}-${String(month).padStart(2, '0')}`;

  return (
    <FormControl maxW={{ base: '100%', sm: '280px' }} w="100%">
      <FormLabel
        fontSize="xs"
        color={getColor('text.dashboard.tileSubtitle')}
        mb={1}
        fontWeight="medium"
      >
        {t('mesada.monthYear')}
      </FormLabel>
      <Input
        type="month"
        value={value}
        min="2000-01"
        max="2100-12"
        onChange={(e) => {
          const v = e.target.value;
          if (!v) return;
          const y = Number(v.slice(0, 4));
          const m = Number(v.slice(5, 7));
          if (
            Number.isFinite(y) &&
            Number.isFinite(m) &&
            m >= 1 &&
            m <= 12
          ) {
            onChange({ year: y, month: m });
          }
        }}
        borderColor={getColor('border.primary')}
        color={getColor('text.familyGroup.title')}
        bg={getColor('background.familyGroup.card')}
        aria-label={t('mesada.monthYearAria')}
      />
    </FormControl>
  );
};
