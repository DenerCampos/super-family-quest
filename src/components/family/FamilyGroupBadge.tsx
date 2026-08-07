import { Badge } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type FamilyGroupBadgeProps = {
  name: string;
};

export const FamilyGroupBadge = ({ name }: FamilyGroupBadgeProps) => {
  const { getColor } = useVisualTheme();

  return (
    <Badge
      w="fit-content"
      px={2}
      py={0.5}
      borderWidth="1px"
      borderColor={getColor('border.primary')}
      bg={getColor('background.familyGroup.memberCard')}
      color={getColor('text.familyGroup.title')}
      textTransform="none"
      fontSize="xs"
      fontWeight="semibold"
      maxW="100%"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      {name}
    </Badge>
  );
};
