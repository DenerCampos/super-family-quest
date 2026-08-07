export const notificationQueryKeys = {
  root: ['notifications'] as const,
  list: (limit: number) =>
    [...notificationQueryKeys.root, 'list', limit] as const,
  unreadCount: () => [...notificationQueryKeys.root, 'unread-count'] as const,
};
