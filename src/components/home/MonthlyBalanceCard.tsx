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

type BalanceValueCardProps = {
  value: number;
  variant: 'revenue' | 'expense' | 'balance';
  label?: string;
  masked?: boolean;
  showValues: boolean;
  valueFont: string;
  bodyFont: string;
};

const BalanceValueCard = ({
  value,
  variant,
  label,
  masked,
  showValues,
  valueFont,
  bodyFont,
}: BalanceValueCardProps) => {
  const { getColor } = useVisualTheme();
  const isRevenue = variant === 'revenue';
  const isBalance = variant === 'balance';

  const borderLeftColor = isBalance
    ? getColor('border.summaryCard.balance')
    : isRevenue
      ? getColor('border.lastRegistrations.revenue')
      : getColor('border.lastRegistrations.expense');

  const bg = isBalance
    ? getColor('background.familyGroup.primary')
    : isRevenue
      ? getColor('background.lastRegistrations.revenue')
      : getColor('background.lastRegistrations.expense');

  const valueColor = isBalance
    ? value >= 0
      ? getColor('status.success')
      : getColor('status.error')
    : isRevenue
      ? getColor('text.lastRegistrations.revenue')
      : getColor('text.lastRegistrations.expense');

  return (
    <Box
      w="full"
      p={2}
      borderRadius="md"
      boxShadow="sm"
      borderLeftWidth="4px"
      borderLeftColor={borderLeftColor}
      bg={bg}
    >
      {label && (
        <Text
          fontSize="xs"
          color={getColor('text.familyGroup.secondary')}
          fontFamily={bodyFont}
          mb={0.5}
          noOfLines={1}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          textAlign="right"
        >
          {label}
        </Text>
      )}
      <Text
        fontSize="md"
        fontWeight="bold"
        fontFamily={valueFont}
        color={valueColor}
        noOfLines={1}
        textAlign="right"
        sx={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatDisplayValue(value, masked, showValues)}
      </Text>
    </Box>
  );
};

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
  const currentMonth = new Date().getMonth() + 1;
  const monthName = t(`common.months.${currentMonth}`);

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
          {title} · {monthName}
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

      <Flex gap={2} align="stretch">
        <Flex flex="3" minW={0} align="center" justify="center">
          <Box w="full">
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
        </Flex>

        <Flex
          direction="column"
          gap={1.5}
          flex="7"
          minW={0}
          justify="center"
        >
          <BalanceValueCard
            value={balance}
            variant="balance"
            label={balanceLabel}
            masked={masked}
            showValues={showValues}
            valueFont={valueFont}
            bodyFont={getFont('body')}
          />

          <BalanceValueCard
            value={income}
            variant="revenue"
            masked={masked}
            showValues={showValues}
            valueFont={valueFont}
            bodyFont={getFont('body')}
          />

          <BalanceValueCard
            value={expenses}
            variant="expense"
            masked={masked}
            showValues={showValues}
            valueFont={valueFont}
            bodyFont={getFont('body')}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
