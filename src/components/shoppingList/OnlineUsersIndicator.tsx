import { Flex, Text, Box } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

interface OnlineUser {
  userId: string;
  userName: string;
}

interface OnlineUsersIndicatorProps {
  users: OnlineUser[];
}

export const OnlineUsersIndicator = ({ users }: OnlineUsersIndicatorProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  if (users.length === 0) return null;

  return (
    <Flex align="center" gap={1} flexWrap="wrap">
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg={getColor('background.shoppingList.onlineIndicator')}
        flexShrink={0}
      />
      <Text
        fontSize="xs"
        color={getColor('text.shoppingList.onlineName')}
        fontFamily={getFont('body')}
      >
        {users.map((u) => u.userName).join(', ')}
      </Text>
      <Text
        fontSize="xs"
        color={getColor('text.shoppingList.onlineName')}
        fontFamily={getFont('body')}
        fontStyle="italic"
      >
        {t('shoppingList.detail.onlineUsers')}
      </Text>
    </Flex>
  );
};
