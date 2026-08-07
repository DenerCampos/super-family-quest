import {
  Button,
  Flex,
  IconButton,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { AppNotification } from '../../types/notification';
import { NotificationListItem } from './NotificationListItem';

type Props = {
  notifications: AppNotification[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onNavigate: () => void;
  onClose: () => void;
};

export const NotificationPanel = ({
  notifications,
  isLoading,
  isError,
  onRetry,
  onNavigate,
  onClose,
}: Props) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const panelBg = getColor('background.familyStories.container');
  const panelBorder = getColor('border.header');
  const titleColor = getColor('text.familyGroup.title');
  const mutedColor = getColor('text.familyGroup.secondary');

  const unread = notifications.filter((n) => !n.readAt);
  const read = notifications.filter((n) => n.readAt);

  const renderBody = () => {
    if (isLoading) {
      return (
        <Flex justify="center" py={6}>
          <Spinner size="sm" color={getColor('text.familyGroup.primary')} />
        </Flex>
      );
    }

    if (isError) {
      return (
        <VStack spacing={3} py={4}>
          <Text fontSize="sm" color={getColor('status.error')} textAlign="center">
            {t('notifications.loadError')}
          </Text>
          <Button
            size="sm"
            variant="outline"
            borderColor={panelBorder}
            color={titleColor}
            onClick={onRetry}
          >
            {t('notifications.retry')}
          </Button>
        </VStack>
      );
    }

    if (notifications.length === 0) {
      return (
        <Text fontSize="sm" color={mutedColor} textAlign="center" py={4}>
          {t('notifications.empty')}
        </Text>
      );
    }

    return (
      <VStack align="stretch" spacing={3}>
        {unread.length > 0 ? (
          <>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              color={mutedColor}
            >
              {t('notifications.unreadSection')}
            </Text>
            {unread.map((item) => (
              <NotificationListItem
                key={item.id}
                item={item}
                borderColor={panelBorder}
                titleColor={titleColor}
                mutedColor={mutedColor}
                onNavigate={onNavigate}
              />
            ))}
          </>
        ) : null}
        {read.length > 0 ? (
          <>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              color={mutedColor}
              mt={unread.length > 0 ? 1 : 0}
            >
              {t('notifications.readSection')}
            </Text>
            {read.map((item) => (
              <NotificationListItem
                key={item.id}
                item={item}
                borderColor={panelBorder}
                titleColor={titleColor}
                mutedColor={mutedColor}
                onNavigate={onNavigate}
              />
            ))}
          </>
        ) : null}
      </VStack>
    );
  };

  return (
    <PopoverContent
      w="min(100vw, 480px)"
      maxW="min(100vw, 480px)"
      mx={0}
      borderRadius="lg"
      bg={panelBg}
      borderWidth="2px"
      borderColor={panelBorder}
      boxShadow="lg"
      color={titleColor}
      _focus={{ outline: 'none' }}
    >
      <PopoverHeader
        fontFamily={getFont('heading')}
        fontWeight="bold"
        color={titleColor}
        borderColor={panelBorder}
        borderBottomWidth="1px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        pr={2}
      >
        <Text as="span">{t('notifications.title')}</Text>
        <IconButton
          aria-label={t('common.close')}
          icon={<FiX />}
          size="sm"
          variant="ghost"
          color={titleColor}
          onClick={onClose}
        />
      </PopoverHeader>
      <PopoverBody maxH="360px" overflowY="auto" p={3}>
        {renderBody()}
      </PopoverBody>
    </PopoverContent>
  );
};
