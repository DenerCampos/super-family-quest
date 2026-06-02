import { useState, useCallback, useEffect } from 'react';
import { ShoppingListService } from '../services/shoppingList';
import type {
  ShoppingListDetailResponse,
  ShoppingListItemResponse,
  CreateShoppingListItemPayload,
  UpdateShoppingListItemPayload,
} from '../types/shoppingList';

function itemExistsInDetail(
  detail: ShoppingListDetailResponse,
  itemId: string,
): boolean {
  return Object.values(detail.itemsByCategory)
    .flat()
    .some((i) => i.id === itemId);
}

function applyItemAddedToDetail(
  prev: ShoppingListDetailResponse,
  item: ShoppingListItemResponse,
): ShoppingListDetailResponse {
  const category = item.group?.name || 'Sem categoria';
  const newItemsByCategory = { ...prev.itemsByCategory };
  const categoryItems = newItemsByCategory[category]
    ? [...newItemsByCategory[category]]
    : [];
  categoryItems.push(item);
  newItemsByCategory[category] = categoryItems;
  return {
    ...prev,
    itemsByCategory: newItemsByCategory,
    itemsCount: prev.itemsCount + 1,
    pendingCount: prev.pendingCount + 1,
  };
}

export function parseQuickAddInput(input: string): {
  name: string;
  quantity: number;
} {
  const trimmed = input.trim();
  const regex = /^(\d+(?:[.,]\d+)?)\s*[xX]\s+(.+)$/;
  const match = regex.exec(trimmed);
  if (match) {
    return {
      quantity: Number.parseFloat(match[1].replace(',', '.')),
      name: match[2].trim(),
    };
  }
  return { name: trimmed, quantity: 1 };
}

export function useShoppingListDetail(listId: string) {
  const [detail, setDetail] = useState<ShoppingListDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!listId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await ShoppingListService.getShoppingListDetail(listId);
      setDetail(data);
    } catch {
      setError('Failed to load shopping list');
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const addItem = useCallback(
    async (payload: CreateShoppingListItemPayload) => {
      const item = await ShoppingListService.addItem(listId, payload);
      return item;
    },
    [listId],
  );

  const addBulkItems = useCallback(
    async (text: string) => {
      const items = await ShoppingListService.addBulkItems(listId, text);
      setDetail((prev) => {
        if (!prev) return prev;
        return items.reduce((acc, item) => {
          if (itemExistsInDetail(acc, item.id)) return acc;
          return applyItemAddedToDetail(acc, item);
        }, prev);
      });
      return items;
    },
    [listId],
  );

  const updateItem = useCallback(
    async (itemId: string, payload: UpdateShoppingListItemPayload) => {
      const item = await ShoppingListService.updateItem(itemId, payload);
      return item;
    },
    [],
  );

  const toggleItem = useCallback(async (itemId: string) => {
    const item = await ShoppingListService.toggleItem(itemId);
    return item;
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    await ShoppingListService.removeItem(itemId);
  }, []);

  const completeList = useCallback(async () => {
    const result = await ShoppingListService.completeShoppingList(listId);
    return result;
  }, [listId]);

  const completeListWithRemaining = useCallback(async () => {
    const result =
      await ShoppingListService.completeShoppingListWithRemaining(listId);
    return result;
  }, [listId]);

  const recreateList = useCallback(async () => {
    const result = await ShoppingListService.recreateShoppingList(listId);
    return result;
  }, [listId]);

  const handleItemAdded = useCallback((item: ShoppingListItemResponse) => {
    setDetail((prev) => {
      if (!prev) return prev;
      if (itemExistsInDetail(prev, item.id)) return prev;
      return applyItemAddedToDetail(prev, item);
    });
  }, []);

  const handleItemUpdated = useCallback((item: ShoppingListItemResponse) => {
    setDetail((prev) => {
      if (!prev) return prev;
      const newItemsByCategory: Record<string, ShoppingListItemResponse[]> = {};
      let found = false;
      for (const [cat, items] of Object.entries(prev.itemsByCategory)) {
        const filtered = items.filter((i) => i.id !== item.id);
        if (filtered.length !== items.length) found = true;
        if (filtered.length > 0) {
          newItemsByCategory[cat] = filtered;
        }
      }
      if (found) {
        const category = item.group?.name || 'Sem categoria';
        const categoryItems = newItemsByCategory[category] || [];
        categoryItems.push(item);
        newItemsByCategory[category] = categoryItems;
      }
      const allItems = Object.values(newItemsByCategory).flat();
      return {
        ...prev,
        itemsByCategory: newItemsByCategory,
        itemsCount: allItems.length,
        pendingCount: allItems.filter((i) => i.status === 'pending').length,
        inCartCount: allItems.filter((i) => i.status === 'in_cart').length,
      };
    });
  }, []);

  const handleItemToggled = useCallback((item: ShoppingListItemResponse) => {
    setDetail((prev) => {
      if (!prev) return prev;
      const newItemsByCategory = { ...prev.itemsByCategory };
      for (const [cat, items] of Object.entries(newItemsByCategory)) {
        const idx = items.findIndex((i) => i.id === item.id);
        if (idx !== -1) {
          const updated = [...items];
          updated[idx] = item;
          newItemsByCategory[cat] = updated;
          break;
        }
      }
      const allItems = Object.values(newItemsByCategory).flat();
      return {
        ...prev,
        itemsByCategory: newItemsByCategory,
        pendingCount: allItems.filter((i) => i.status === 'pending').length,
        inCartCount: allItems.filter((i) => i.status === 'in_cart').length,
      };
    });
  }, []);

  const handleItemRemoved = useCallback((data: { itemId: string }) => {
    setDetail((prev) => {
      if (!prev) return prev;
      const newItemsByCategory: Record<string, ShoppingListItemResponse[]> = {};
      let removedStatus: string | null = null;
      for (const [cat, items] of Object.entries(prev.itemsByCategory)) {
        const filtered = items.filter((i) => {
          if (i.id === data.itemId) {
            removedStatus = i.status;
            return false;
          }
          return true;
        });
        if (filtered.length > 0) {
          newItemsByCategory[cat] = filtered;
        }
      }
      return {
        ...prev,
        itemsByCategory: newItemsByCategory,
        itemsCount: prev.itemsCount - 1,
        pendingCount:
          removedStatus === 'pending'
            ? prev.pendingCount - 1
            : prev.pendingCount,
        inCartCount:
          removedStatus === 'in_cart'
            ? prev.inCartCount - 1
            : prev.inCartCount,
      };
    });
  }, []);

  const handleListCompleted = useCallback(() => {
    setDetail((prev) => {
      if (!prev) return prev;
      const newItemsByCategory: Record<string, ShoppingListItemResponse[]> = {};
      for (const [cat, items] of Object.entries(prev.itemsByCategory)) {
        newItemsByCategory[cat] = items.map((i) => ({
          ...i,
          status: 'in_cart' as const,
        }));
      }
      const allItems = Object.values(newItemsByCategory).flat();
      return {
        ...prev,
        status: 'completed',
        itemsByCategory: newItemsByCategory,
        pendingCount: 0,
        inCartCount: allItems.length,
      };
    });
  }, []);

  return {
    detail,
    isLoading,
    error,
    refresh: fetchDetail,
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
  };
}
