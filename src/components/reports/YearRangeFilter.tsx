import { Flex, Box, Select, Text } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { getYearOptions } from '../../utils/yearOptions';

interface YearRangeFilterProps {
  startYear: number;
  endYear: number;
  onStartYearChange: (year: number) => void;
  onEndYearChange: (year: number) => void;
}

export const YearRangeFilter = ({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
}: YearRangeFilterProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <Flex gap={2} width="100%">
      <Box flex={1}>
        <Text
          fontSize="xs"
          color={getColor('text.dashboard.filterLabel')}
          fontWeight="medium"
          fontFamily={getFont('body')}
          mb={1}
        >
          {t('reports.dateRangeFilter.startDate')}
        </Text>
        <Select
          value={startYear}
          onChange={(e) => onStartYearChange(Number(e.target.value))}
          size="sm"
          borderRadius="md"
          fontFamily={getFont('body')}
          color={getColor('text.dashboard.filterLabel')}
          borderColor={getColor('border.dashboard.tile')}
          bg={getColor('background.dashboard.filterBar')}
        >
          {getYearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </Box>
      <Box flex={1}>
        <Text
          fontSize="xs"
          color={getColor('text.dashboard.filterLabel')}
          fontWeight="medium"
          fontFamily={getFont('body')}
          mb={1}
        >
          {t('reports.dateRangeFilter.endDate')}
        </Text>
        <Select
          value={endYear}
          onChange={(e) => onEndYearChange(Number(e.target.value))}
          size="sm"
          borderRadius="md"
          fontFamily={getFont('body')}
          color={getColor('text.dashboard.filterLabel')}
          borderColor={getColor('border.dashboard.tile')}
          bg={getColor('background.dashboard.filterBar')}
        >
          {getYearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </Box>
    </Flex>
  );
};
