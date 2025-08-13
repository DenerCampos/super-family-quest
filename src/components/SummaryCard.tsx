// components/SummaryCard.tsx
import { Card, CardBody, Text, Heading } from '@chakra-ui/react';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../contexts/AuthContext';
import { useVisualTheme } from '../hooks/useVisualTheme';

type Props = {
  title: string;
  value: number;
  colorScheme: 'green' | 'red';
};

export const SummaryCard = ({ title, value, colorScheme }: Props) => {
  const { showValues } = useAuth();
  const { getColor } = useVisualTheme();

  console.log(getColor('summaryCard.revenue.bg'));

  const colors = {
    green: {
      bg: getColor('summaryCard.revenue.bg'),
      border: getColor('summaryCard.revenue.border'),
      text: getColor('summaryCard.revenue.text'),
      heading: getColor('summaryCard.revenue.heading'),
    },
    red: {
      bg: getColor('summaryCard.expense.bg'),
      border: getColor('summaryCard.expense.border'),
      text: getColor('summaryCard.expense.text'),
      heading: getColor('summaryCard.expense.heading'),
    },
  };

  return (
    <Card
      bg={colors[colorScheme].bg}
      borderLeft="4px solid"
      borderColor={colors[colorScheme].border}
    >
      <CardBody>
        <Text fontSize="sm" color={colors[colorScheme].text}>
          {title}
        </Text>
        <Heading size="lg" color={colors[colorScheme].heading} letterSpacing="2px">
          {showValues ? formatCurrency(value) : '••••••••'}
        </Heading>
      </CardBody>
    </Card>
  );
};
