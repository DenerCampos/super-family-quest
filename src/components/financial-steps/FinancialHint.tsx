import { Flex, Icon, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type Props = {
  children: React.ReactNode;
  icon?: IconType;
  fontSize?: 'xs' | 'sm';
  mb?: number;
};

/** Texto auxiliar legível sobre fundos escuros dos formulários financeiros. */
export const FinancialHint = ({
  children,
  icon,
  fontSize = 'xs',
  mb = 2,
}: Props) => {
  const { getColor } = useVisualTheme();

  return (
    <Flex
      align="flex-start"
      gap={2}
      px={3}
      py={2}
      mb={mb}
      borderRadius="md"
      bg={getColor('background.financial.hint')}
      border="1px solid"
      borderColor={getColor('border.financial.hint')}
      color={getColor('text.muted')}
      flexShrink={0}
    >
      {icon && (
        <Icon as={icon} boxSize={4} mt="1px" flexShrink={0} aria-hidden />
      )}
      <Text fontSize={fontSize} lineHeight="short">
        {children}
      </Text>
    </Flex>
  );
};
