import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { HomePieChart } from '../HomePieChart';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { formatCurrency } from '../../utils/formatCurrency';

type Props = {
  title: string;
  balanceLabel: string;
  income: number;
  expenses: number;
  masked?: boolean;
  showValues: boolean;
  onToggleVisibility: () => void;
  revenueColor: string;
  expenseColor: string;
  emptyFillColor: string;
  emptyLabelColor: string;
};

function formatDisplayValue(
  value: number,
  masked: boolean | undefined,
  showValues: boolean,
): string {
  if (masked) return '? ? ? ?';
  if (!showValues) return '••••••••';
  return formatCurrency(value);
}

export const MonthlyBalanceCard = ({
  title,
  balanceLabel,
  income,
  expenses,
  masked,
  showValues,
  onToggleVisibility,
  revenueColor,
  expenseColor,
  emptyFillColor,
  emptyLabelColor,
}: Props) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const balance = income - expenses;
  const valueFont = getFont('numeric');

  return (
    <Box
      bg={getColor('background.familyGroup.card')}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={getColor('border.familyGroup.card')}
      boxShadow="sm"
      p={3}
    >
      <Flex align="center" justify="space-between" mb={2}>
        <Text
          fontSize="sm"
          fontWeight="bold"
          color={getColor('text.familyGroup.title')}
          fontFamily={getFont('heading')}
        >
          {title}
        </Text>
        <IconButton
          aria-label={showValues ? t('common.hideValues') : t('common.showValues')}
          icon={<Icon as={showValues ? FiEyeOff : FiEye} />}
          size="xs"
          variant="ghost"
          color={getColor('text.eye')}
          minW="auto"
          h="auto"
          p={1}
          onClick={onToggleVisibility}
          _hover={{
            bg: getColor('button.hover.background.inverse'),
            color: getColor('button.hover.text.inverse'),
          }}
        />
      </Flex>

      <Flex gap={3} align="center">
        <Box w="100px" flexShrink={0} alignSelf="stretch">
          <HomePieChart
            income={income}
            expenses={expenses}
            masked={masked}
            compact
            revenueColor={revenueColor}
            expenseColor={expenseColor}
            revenueLabelColor={getColor('text.summaryCard.revenue')}
            expenseLabelColor={getColor('text.summaryCard.expense')}
            emptyFillColor={emptyFillColor}
            emptyLabelColor={emptyLabelColor}
            strokeColor={getColor('background.familyGroup.card')}
          />
        </Box>

        <Flex
          direction="column"
          gap={1}
          flex={1}
          minW={0}
          justify="center"
          align="flex-end"
        >
          <Box w="full" minW={0}>
            <Text
              fontSize="xs"
              color={getColor('text.familyGroup.secondary')}
              fontFamily={getFont('body')}
              mb={0.5}
              noOfLines={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              textAlign="right"
            >
              {balanceLabel}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              fontFamily={valueFont}
              color={
                balance >= 0
                  ? getColor('status.success')
                  : getColor('status.error')
              }
              noOfLines={1}
              textAlign="right"
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatDisplayValue(balance, masked, showValues)}
            </Text>
          </Box>

          <Flex align="center" justify="flex-end" gap={1.5} w="full">
            <Box
              w="9px"
              h="9px"
              borderRadius="full"
              bg={getColor('border.summaryCard.revenue')}
              flexShrink={0}
            />
            <Text
              fontSize="md"
              fontWeight="semibold"
              fontFamily={valueFont}
              color={getColor('text.summaryCard.revenue')}
              noOfLines={1}
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatDisplayValue(income, masked, showValues)}
            </Text>
          </Flex>

          <Flex align="center" justify="flex-end" gap={1.5} w="full">
            <Box
              w="9px"
              h="9px"
              borderRadius="full"
              bg={getColor('border.summaryCard.expense')}
              flexShrink={0}
            />
            <Text
              fontSize="md"
              fontWeight="semibold"
              fontFamily={valueFont}
              color={getColor('text.summaryCard.expense')}
              noOfLines={1}
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatDisplayValue(expenses, masked, showValues)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
