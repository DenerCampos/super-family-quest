import { Flex, Select } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { getYearOptions } from '../../utils/yearOptions';

interface ReportMonthYearFilterProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export const ReportMonthYearFilter = ({
  month,
  year,
  onMonthChange,
  onYearChange,
}: ReportMonthYearFilterProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <Flex gap={2} width="100%">
      <Select
        value={month}
        onChange={(e) => onMonthChange(Number(e.target.value))}
        size="sm"
        borderRadius="md"
        fontFamily={getFont('body')}
        color={getColor('text.dashboard.filterLabel')}
        borderColor={getColor('border.dashboard.tile')}
        bg={getColor('background.dashboard.filterBar')}
        flex={1}
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
        color={getColor('text.dashboard.filterLabel')}
        borderColor={getColor('border.dashboard.tile')}
        bg={getColor('background.dashboard.filterBar')}
        flex={1}
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
