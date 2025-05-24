// components/SummaryCard.tsx
import { Card, CardBody, Text, Heading } from '@chakra-ui/react';
import { formatCurrency } from '../utils/formatCurrency';

type Props = {
  title: string;
  value: number;
  colorScheme: 'green' | 'red';
};

export const SummaryCard = ({ title, value, colorScheme }: Props) => {
  const colors = {
    green: {
      bg: 'green.100',
      border: 'green.500',
      text: 'green.800',
      heading: 'green.900',
    },
    red: {
      bg: 'red.100',
      border: 'red.500',
      text: 'red.800',
      heading: 'red.900',
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
        <Heading size="lg" color={colors[colorScheme].heading}>
          {formatCurrency(value)}
        </Heading>
      </CardBody>
    </Card>
  );
};
