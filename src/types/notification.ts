export type NotificationType = 'family_group_invite' | string;

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  actorName: string;
  actionUrl: string | null;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationUnreadCount = {
  count: number;
};

export type MarkNotificationsReadResponse = {
  updated: number;
};
