import { Flex, Input, Text } from "@chakra-ui/react";

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
  return (
    <Flex 
      gap={4} 
      mb={4} 
      direction={{ base: "column", sm: "row" }} 
      align="center"
      justify="center"
      bg="purple.50"
      p={4}
      borderRadius="md"
      width="100%"
    >
      <Flex align="center" gap={2}>
        <Text fontSize="sm" color="purple.700" whiteSpace="nowrap" fontWeight="medium">
          Data Inicial:
        </Text>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          size="sm"
          w="auto"
          borderColor="purple.200"
          _hover={{ borderColor: "purple.300" }}
          _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
          bg="white"
        />
      </Flex>
      <Flex align="center" gap={2}>
        <Text fontSize="sm" color="purple.700" whiteSpace="nowrap" fontWeight="medium">
          Data Final:
        </Text>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          size="sm"
          w="auto"
          borderColor="purple.200"
          _hover={{ borderColor: "purple.300" }}
          _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
          bg="white"
        />
      </Flex>
    </Flex>
  );
}; 