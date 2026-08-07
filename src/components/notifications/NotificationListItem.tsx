import { Box, Link, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { AppNotification } from '../../types/notification';
import { formatAppDateTime } from '../../utils/formatDate';
import { isSafeAppPath } from '../../utils/isSafeAppPath';

type Props = {
  item: AppNotification;
  borderColor: string;
  titleColor: string;
  mutedColor: string;
  onNavigate: () => void;
};

export const NotificationListItem = ({
  item,
  borderColor,
  titleColor,
  mutedColor,
  onNavigate,
}: Props) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const isUnread = !item.readAt;
  const safeActionUrl =
    item.actionUrl && isSafeAppPath(item.actionUrl) ? item.actionUrl : null;

  const handleActionClick = () => {
    if (!safeActionUrl) return;
    onNavigate();
    navigate(safeActionUrl);
  };

  return (
    <Box
      w="100%"
      p={3}
      borderRadius="md"
      bg={getColor('background.familyGroup.card')}
      borderWidth="1px"
      borderColor={borderColor}
      opacity={isUnread ? 1 : 0.75}
    >
      <Text
        fontWeight="bold"
        fontSize="sm"
        fontFamily={getFont('heading')}
        color={titleColor}
      >
        {item.title}
      </Text>
      <Text fontSize="sm" mt={1} color={getColor('text.familyGroup.primary')}>
        {item.body}
      </Text>
      {safeActionUrl ? (
        <Link
          mt={2}
          display="inline-block"
          fontSize="sm"
          fontWeight="semibold"
          color={getColor('text.familyGroup.badge.notification')}
          onClick={handleActionClick}
        >
          {t('notifications.openLink')}
        </Link>
      ) : null}
      <Text mt={2} fontSize="xs" color={mutedColor}>
        {item.actorName} · {formatAppDateTime(item.createdAt)}
      </Text>
    </Box>
  );
};
