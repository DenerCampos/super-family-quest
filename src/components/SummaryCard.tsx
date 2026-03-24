import { Card, CardBody, Text, Heading } from '@chakra-ui/react';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../contexts/AuthContext';
import { useVisualTheme } from '../hooks/useVisualTheme';

type Props = {
  title: string;
  value: number;
  type: 'revenue' | 'expense';
  compact?: boolean;
};

export const SummaryCard = ({ title, value, type, compact }: Props) => {
  const { showValues } = useAuth();
  const { getColor, getFont} = useVisualTheme();

  const colors = {
    revenue: {
      bg: getColor('background.summaryCard.revenue'),
      border: getColor('border.summaryCard.revenue'),
      text: getColor('text.summaryCard.revenue'),
      heading: getColor('text.summaryCard.revenue'),
    },
    expense: {
      bg: getColor('background.summaryCard.expense'),
      border: getColor('border.summaryCard.expense'),
      text: getColor('text.summaryCard.expense'),
      heading: getColor('text.summaryCard.expense'),
    },
  };

  return (
    <Card
      bg={colors[type].bg}
      borderLeft="4px solid"
      borderColor={colors[type].border}
    >
      <CardBody py={compact ? 2 : undefined} px={compact ? 3 : undefined}>
        <Text
          fontSize={compact ? 'xs' : 'md'}
          color={colors[type].text}
          fontFamily={getFont('body')}
          fontWeight="bold"
          noOfLines={1}
        >
          {title}
        </Text>
        <Heading
          size={compact ? 'sm' : 'lg'}
          color={colors[type].heading}
          letterSpacing={compact ? '1px' : '2px'}
          fontFamily={getFont('mono')}
          noOfLines={1}
        >
          {showValues ? formatCurrency(value) : '••••••••'}
        </Heading>
      </CardBody>
    </Card>
  );
};
