import { Avatar, Flex, Text } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { UserSummary } from '../../types/user';

interface UserBadgeProps {
  user: UserSummary;
}

const UserBadge = ({ user }: UserBadgeProps) => {
  const { getColor } = useVisualTheme();

  return (
    <Flex
      align="center"
      gap={1}
      bg={getColor('background.resourceTable.userBadge')}
      borderRadius="full"
      px={2}
      py={0.5}
    >
      <Avatar
        size="2xs"
        name={user.name}
        src={user.profileImage || undefined}
      />
      <Text fontSize="xs" color={getColor('text.resourceTable.userBadge')}>
        {user.name.split(' ')[0]}
      </Text>
    </Flex>
  );
};

export default UserBadge;
