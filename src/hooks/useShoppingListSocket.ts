import { useEffect, useRef, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ShoppingListItemResponse } from '../types/shoppingList';

const API_URL = import.meta.env.VITE_API_URL;

interface OnlineUser {
  userId: string;
  userName: string;
}

interface UseShoppingListSocketOptions {
  listId: string;
  token: string;
  onItemAdded?: (item: ShoppingListItemResponse) => void;
  onItemUpdated?: (item: ShoppingListItemResponse) => void;
  onItemToggled?: (item: ShoppingListItemResponse) => void;
  onItemRemoved?: (data: { itemId: string }) => void;
  onListCompleted?: (data: { listId: string }) => void;
}

export function useShoppingListSocket({
  listId,
  token,
  onItemAdded,
  onItemUpdated,
  onItemToggled,
  onItemRemoved,
  onListCompleted,
}: UseShoppingListSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const onItemAddedRef = useRef(onItemAdded);
  const onItemUpdatedRef = useRef(onItemUpdated);
  const onItemToggledRef = useRef(onItemToggled);
  const onItemRemovedRef = useRef(onItemRemoved);
  const onListCompletedRef = useRef(onListCompleted);

  onItemAddedRef.current = onItemAdded;
  onItemUpdatedRef.current = onItemUpdated;
  onItemToggledRef.current = onItemToggled;
  onItemRemovedRef.current = onItemRemoved;
  onListCompletedRef.current = onListCompleted;

  useEffect(() => {
    if (!listId || !token) return;

    const socket = io(`${API_URL}/shopping-list`, {
      auth: { token },
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinList', { listId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('user_joined', (user: OnlineUser) => {
      setOnlineUsers((prev) => [
        ...prev.filter((u) => u.userId !== user.userId),
        user,
      ]);
    });

    socket.on('user_left', (user: OnlineUser) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== user.userId));
    });

    socket.on('item_added', (item: ShoppingListItemResponse) => {
      onItemAddedRef.current?.(item);
    });

    socket.on('item_updated', (item: ShoppingListItemResponse) => {
      onItemUpdatedRef.current?.(item);
    });

    socket.on('item_toggled', (item: ShoppingListItemResponse) => {
      onItemToggledRef.current?.(item);
    });

    socket.on('item_removed', (data: { itemId: string }) => {
      onItemRemovedRef.current?.(data);
    });

    socket.on('list_completed', (data: { listId: string }) => {
      onListCompletedRef.current?.(data);
    });

    socketRef.current = socket;

    return () => {
      socket.emit('leaveList', { listId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [listId, token]);

  const emitEvent = useCallback(
    (event: string, data?: unknown) => {
      socketRef.current?.emit(event, data);
    },
    [],
  );

  return { socket: socketRef.current, onlineUsers, isConnected, emitEvent };
}
