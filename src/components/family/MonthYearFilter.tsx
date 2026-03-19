import { Flex, Select } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

type MonthYearFilterProps = {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= 2020; y--) {
    years.push(y);
  }
  return years;
}

export const MonthYearFilter = ({
  month,
  year,
  onMonthChange,
  onYearChange,
}: MonthYearFilterProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <Flex gap={2}>
      <Select
        value={month}
        onChange={(e) => onMonthChange(Number(e.target.value))}
        size="sm"
        borderRadius="md"
        fontFamily={getFont('body')}
        color={getColor('text.familyGroup.primary')}
        borderColor={getColor('border.familyGroup.card')}
        bg={getColor('background.familyGroup.card')}
        aria-label={t('familyGroup.month')}
      >
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {t(`common.months.${m}`)}
          </option>
        ))}
      </Select>
      <Select
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
        size="sm"
        borderRadius="md"
        fontFamily={getFont('body')}
        color={getColor('text.familyGroup.primary')}
        borderColor={getColor('border.familyGroup.card')}
        bg={getColor('background.familyGroup.card')}
        aria-label={t('familyGroup.year')}
      >
        {getYearOptions().map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
