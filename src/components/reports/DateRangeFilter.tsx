import { Flex, Box, Input, Text } from "@chakra-ui/react";
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const getDefaultDates = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    firstDay: firstDay.toISOString().split('T')[0],
    lastDay: lastDay.toISOString().split('T')[0]
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export const defaultDates = getDefaultDates();

export const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) => {
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();

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
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          size="sm"
          borderRadius="md"
          fontFamily={getFont('body')}
          color={getColor('text.dashboard.filterLabel')}
          borderColor={getColor('border.dashboard.tile')}
          bg={getColor('background.dashboard.filterBar')}
          _hover={{ borderColor: getColor('border.dashboard.tileActive') }}
          _focus={{ borderColor: getColor('border.dashboard.tileActive') }}
          width="100%"
        />
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
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          size="sm"
          borderRadius="md"
          fontFamily={getFont('body')}
          color={getColor('text.dashboard.filterLabel')}
          borderColor={getColor('border.dashboard.tile')}
          bg={getColor('background.dashboard.filterBar')}
          _hover={{ borderColor: getColor('border.dashboard.tileActive') }}
          _focus={{ borderColor: getColor('border.dashboard.tileActive') }}
          width="100%"
        />
      </Box>
    </Flex>
  );
};
