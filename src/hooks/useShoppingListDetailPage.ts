import { useCallback, useMemo, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useShoppingListDetail } from './useShoppingListDetail';
import { useShoppingListSocket } from './useShoppingListSocket';
import { useThemedTranslation } from './useThemedTranslation';
import type {
  CreateShoppingListItemPayload,
  ShoppingListItemResponse,
  UpdateShoppingListItemPayload,
} from '../types/shoppingList';

export type ShoppingListPendingAction =
  | 'finish'
  | 'finishRemaining'
  | 'recreate';

export function useShoppingListDetailPage(listId: string) {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useThemedTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] =
    useState<ShoppingListItemResponse | null>(null);
  const [togglingItems, setTogglingItems] = useState<Set<string>>(new Set());
  const [pendingListAction, setPendingListAction] =
    useState<ShoppingListPendingAction | null>(null);

  const {
    detail,
    isLoading,
    addItem,
    addBulkItems,
    updateItem,
    toggleItem,
    removeItem,
    completeList,
    completeListWithRemaining,
    recreateList,
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

  const runConfirmedListAction = useCallback(
    async (
      actionKey: ShoppingListPendingAction,
      confirmKey: string,
      action: () => Promise<unknown>,
      successKey: string,
      errorKey: string,
    ) => {
      if (pendingListAction) return;
      if (!globalThis.confirm(t(confirmKey))) return;

      setPendingListAction(actionKey);
      try {
        await action();
        toast({
          title: t(successKey),
          status: 'success',
          duration: 2000,
        });
        navigate('/new-resources/shopping');
      } catch {
        toast({
          title: t(errorKey),
          status: 'error',
          duration: 3000,
        });
      } finally {
        setPendingListAction(null);
      }
    },
    [navigate, pendingListAction, t, toast],
  );

  const handleFinishList = useCallback(async () => {
    await runConfirmedListAction(
      'finish',
      'shoppingList.detail.finishListConfirm',
      completeList,
      'shoppingList.detail.listCompleted',
      'shoppingList.detail.listCompletedError',
    );
  }, [completeList, runConfirmedListAction]);

  const handleFinishAndCreateRemaining = useCallback(async () => {
    await runConfirmedListAction(
      'finishRemaining',
      'shoppingList.detail.finishAndCreateRemainingConfirm',
      completeListWithRemaining,
      'shoppingList.detail.listCompletedWithRemaining',
      'shoppingList.detail.listCompletedWithRemainingError',
    );
  }, [completeListWithRemaining, runConfirmedListAction]);

  const handleRecreateList = useCallback(async () => {
    await runConfirmedListAction(
      'recreate',
      'shoppingList.detail.recreateListConfirm',
      recreateList,
      'shoppingList.detail.listRecreated',
      'shoppingList.detail.listRecreatedError',
    );
  }, [recreateList, runConfirmedListAction]);

  const handleCloseEditModal = useCallback(() => {
    onClose();
    setEditingItem(null);
  }, [onClose]);

  const canFinishWithRemaining =
    (detail?.inCartCount ?? 0) > 0 && (detail?.pendingCount ?? 0) > 0;

  const isListActionPending = pendingListAction !== null;

  const listActionLoadingText = useMemo(() => {
    switch (pendingListAction) {
      case 'finish':
        return t('shoppingList.detail.finishingList');
      case 'finishRemaining':
        return t('shoppingList.detail.finishingAndCreatingList');
      case 'recreate':
        return t('shoppingList.detail.recreatingList');
      default:
        return t('common.loading');
    }
  }, [pendingListAction, t]);

  return {
    detail,
    isLoading,
    onlineUsers,
    isCompleted: detail?.status === 'completed',
    canFinishWithRemaining,
    pendingListAction,
    isListActionPending,
    listActionLoadingText,
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
    handleFinishAndCreateRemaining,
    handleRecreateList,
    handleCloseEditModal,
  };
}
