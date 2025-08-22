import { Flex, Input, Text } from "@chakra-ui/react";
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

export const defaultDates = getDefaultDates();

export const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) => {
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  return (
    <Flex 
      gap={4} 
      mb={4} 
      direction={{ base: "column", sm: "row" }} 
      align="center"
      justify="center"
      bg={getColor('background.dateRangeFilter')}
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor={getColor('border.primary')}
      width="100%"
    >
      <Flex align="center" gap={2}>
        <Text fontSize="sm" color={getColor('text.dateRangeFilter')} whiteSpace="nowrap" fontWeight="medium">
          {t('reports.dateRangeFilter.startDate')}
        </Text>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          size="sm"
          w="auto"
          borderColor={getColor('border.primary')}
          _hover={{ borderColor: getColor('border.primary') }}
          _focus={{ borderColor: getColor('border.primary')}}
          bg={getColor('background.quaternary')}
        />
      </Flex>
      <Flex align="center" gap={2}>
        <Text fontSize="sm" color={getColor('text.dateRangeFilter')} whiteSpace="nowrap" fontWeight="medium">
          {t('reports.dateRangeFilter.endDate')}
        </Text>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          size="sm"
          w="auto"
          borderColor={getColor('border.primary')}
          _hover={{ borderColor: getColor('border.primary') }}
          _focus={{ borderColor: getColor('border.primary')}}
          bg={getColor('background.quaternary')}
        />
      </Flex>
    </Flex>
  );
}; 