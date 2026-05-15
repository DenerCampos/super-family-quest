import { useCallback, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useShoppingListDetail } from './useShoppingListDetail';
import { useShoppingListSocket } from './useShoppingListSocket';
import { useThemedTranslation } from './useThemedTranslation';
import type {
  CreateShoppingListItemPayload,
  ShoppingListItemResponse,
  UpdateShoppingListItemPayload,
} from '../types/shoppingList';

export function useShoppingListDetailPage(listId: string) {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] =
    useState<ShoppingListItemResponse | null>(null);
  const [togglingItems, setTogglingItems] = useState<Set<string>>(new Set());

  const {
    detail,
    isLoading,
    addItem,
    addBulkItems,
    updateItem,
    toggleItem,
    removeItem,
    completeList,
    handleItemAdded,
    handleItemUpdated,
    handleItemToggled,
    handleItemRemoved,
    handleListCompleted,
  } = useShoppingListDetail(listId);

  const token = localStorage.getItem('accessToken') || '';

  const { onlineUsers } = useShoppingListSocket({
    listId,
    token,
    onItemAdded: handleItemAdded,
    onItemUpdated: handleItemUpdated,
    onItemToggled: handleItemToggled,
    onItemRemoved: handleItemRemoved,
    onListCompleted: handleListCompleted,
  });

  const handleAddItem = useCallback(
    async (payload: CreateShoppingListItemPayload) => {
      try {
        await addItem(payload);
      } catch {
        toast({
          title: t('shoppingList.item.addError'),
          status: 'error',
          duration: 3000,
        });
      }
    },
    [addItem, t, toast],
  );

  const handleAddBulk = useCallback(
    async (text: string) => {
      try {
        await addBulkItems(text);
      } catch {
        toast({
          title: t('shoppingList.item.bulkAddError'),
          status: 'error',
          duration: 3000,
        });
      }
    },
    [addBulkItems, t, toast],
  );

  const handleToggle = useCallback(
    async (itemId: string) => {
      setTogglingItems((prev) => new Set(prev).add(itemId));
      try {
        await toggleItem(itemId);
      } catch {
        toast({
          title: t('shoppingList.item.toggleError'),
          status: 'error',
          duration: 3000,
        });
      } finally {
        setTogglingItems((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    },
    [t, toast, toggleItem],
  );

  const handleEdit = useCallback(
    (item: ShoppingListItemResponse) => {
      setEditingItem(item);
      onOpen();
    },
    [onOpen],
  );

  const handleSaveEdit = useCallback(
    async (itemId: string, payload: UpdateShoppingListItemPayload) => {
      try {
        await updateItem(itemId, payload);
      } catch {
        toast({
          title: t('shoppingList.item.editError'),
          status: 'error',
          duration: 3000,
        });
        throw new Error('Failed to edit item');
      }
    },
    [t, toast, updateItem],
  );

  const handleDelete = useCallback(
    async (itemId: string) => {
      if (!globalThis.confirm(t('shoppingList.item.deleteConfirm'))) return;
      try {
        await removeItem(itemId);
      } catch {
        toast({
          title: t('shoppingList.item.deleteError'),
          status: 'error',
          duration: 3000,
        });
      }
    },
    [removeItem, t, toast],
  );

  const handleFinishList = useCallback(async () => {
    if (!globalThis.confirm(t('shoppingList.detail.finishListConfirm'))) return;
    try {
      await completeList();
      toast({
        title: t('shoppingList.detail.listCompleted'),
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: t('shoppingList.detail.listCompletedError'),
        status: 'error',
        duration: 3000,
      });
    }
  }, [completeList, t, toast]);

  const handleCloseEditModal = useCallback(() => {
    onClose();
    setEditingItem(null);
  }, [onClose]);

  return {
    detail,
    isLoading,
    onlineUsers,
    isCompleted: detail?.status === 'completed',
    togglingItems,
    editingItem,
    isOpen,
    t,
    handleAddItem,
    handleAddBulk,
    handleToggle,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleFinishList,
    handleCloseEditModal,
  };
}
