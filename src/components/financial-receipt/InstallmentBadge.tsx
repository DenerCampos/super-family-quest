import { Badge } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type Props = {
  label: string | null | undefined;
  variant?: 'expense' | 'revenue';
};

export const InstallmentBadge = ({ label, variant = 'expense' }: Props) => {
  const { getColor } = useVisualTheme();
  if (!label) return null;

  const color =
    variant === 'expense'
      ? getColor('text.lastRegistrations.expense')
      : getColor('text.lastRegistrations.revenue');
  const bg =
    variant === 'expense'
      ? getColor('background.lastRegistrations.badge.expense')
      : getColor('background.lastRegistrations.badge.revenue');

  return (
    <Badge color={color} bg={bg} borderRadius="md" fontSize="xs">
      {label}
    </Badge>
  );
};
