import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services';
import { notificationQueryKeys } from './notificationQueryKeys';

const LIST_LIMIT = 20;

export function useNotifications(options?: { listEnabled?: boolean }) {
  const queryClient = useQueryClient();
  const listEnabled = options?.listEnabled ?? false;

  const unreadCountQuery = useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: api.notificationUnreadCount,
    refetchOnWindowFocus: true,
  });

  const listQuery = useQuery({
    queryKey: notificationQueryKeys.list(LIST_LIMIT),
    queryFn: () => api.notificationList(LIST_LIMIT),
    enabled: listEnabled,
  });

  const markReadMutation = useMutation({
    mutationFn: (ids: string[]) => api.notificationMarkAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.root });
    },
  });

  const notifications = listQuery.data ?? [];
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  return {
    notifications,
    unreadCount,
    listLimit: LIST_LIMIT,
    isLoadingList: listQuery.isLoading,
    isErrorList: listQuery.isError,
    refetchList: listQuery.refetch,
    refetchUnreadCount: unreadCountQuery.refetch,
    markAsRead: markReadMutation.mutateAsync,
    isMarkingRead: markReadMutation.isPending,
  };
}
