import type {
  AppNotification,
  MarkNotificationsReadResponse,
  NotificationUnreadCount,
} from '../types/notification';
import api from './api';

export const NotificationService = {
  list: async (limit = 20): Promise<AppNotification[]> => {
    const response = await api.get<AppNotification[]>('/notifications', {
      params: { limit },
    });
    return response.data;
  },

  unreadCount: async (): Promise<NotificationUnreadCount> => {
    const response = await api.get<NotificationUnreadCount>(
      '/notifications/unread-count',
    );
    return response.data;
  },

  markAsRead: async (ids: string[]): Promise<MarkNotificationsReadResponse> => {
    const response = await api.patch<MarkNotificationsReadResponse>(
      '/notifications/read',
      { ids },
    );
    return response.data;
  },
};
