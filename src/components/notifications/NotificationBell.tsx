import {
  Badge,
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { NotificationPanel } from './NotificationPanel';

const APP_SHELL_MAX_W = 480;

export const NotificationBell = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoadingList,
    isErrorList,
    refetchList,
    markAsRead,
  } = useNotifications({ listEnabled: isOpen });

  const badgeLabel =
    unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = async () => {
    const idsToMark = notifications.filter((n) => !n.readAt).map((n) => n.id);

    setIsOpen(false);

    if (idsToMark.length > 0) {
      try {
        await markAsRead(idsToMark);
      } catch {
        // badge atualiza no próximo refetch; não bloquear fechamento
      }
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={handleOpen}
      onClose={() => {
        void handleClose();
      }}
      placement="bottom-start"
      strategy="fixed"
      gutter={8}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: ({ reference }: { reference: { x: number } }) => {
              const shellW = Math.min(window.innerWidth, APP_SHELL_MAX_W);
              const shellLeft = Math.max(0, (window.innerWidth - shellW) / 2);
              return [shellLeft - reference.x, 8];
            },
          },
        },
      ]}
      isLazy
      closeOnBlur
    >
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            icon={<FiBell />}
            aria-label={t('notifications.open')}
            variant="ghost"
            bg={getColor('button.background.primary')}
            color={getColor('text.header')}
            _hover={{
              bg: getColor('button.hover.background.inverse'),
              color: getColor('button.hover.text.inverse'),
            }}
          />
          {badgeLabel ? (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              borderRadius="full"
              px={1.5}
              minW="18px"
              textAlign="center"
              fontSize="0.65rem"
              bg={getColor('background.familyGroup.badge.notification')}
              color={getColor('text.familyGroup.badge.notification')}
            >
              {badgeLabel}
            </Badge>
          ) : null}
        </Box>
      </PopoverTrigger>
      <Portal>
        <NotificationPanel
          notifications={notifications}
          isLoading={isLoadingList}
          isError={isErrorList}
          onRetry={() => {
            void refetchList();
          }}
          onNavigate={() => {
            void handleClose();
          }}
          onClose={() => {
            void handleClose();
          }}
        />
      </Portal>
    </Popover>
  );
};
