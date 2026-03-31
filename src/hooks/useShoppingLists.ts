import { useState, useEffect, useCallback } from 'react';
import { ShoppingListService } from '../services/shoppingList';
import type {
  ShoppingListResponse,
  ShoppingListStatus,
  PaginatedResponse,
  CreateShoppingListPayload,
} from '../types/shoppingList';

interface UseShoppingListsOptions {
  initialStatus?: ShoppingListStatus;
  limit?: number;
}

export function useShoppingLists(options?: UseShoppingListsOptions) {
  const [lists, setLists] = useState<ShoppingListResponse[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<ShoppingListResponse>['meta'] | null>(null);
  const [status, setStatus] = useState<ShoppingListStatus | undefined>(
    options?.initialStatus ?? 'active',
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = options?.limit ?? 10;

  const fetchLists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ShoppingListService.getShoppingLists({
        page,
        limit,
        status,
      });
      setLists(response.data);
      setMeta(response.meta);
    } catch {
      setError('Failed to load shopping lists');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createList = useCallback(
    async (payload: CreateShoppingListPayload) => {
      const newList = await ShoppingListService.createShoppingList(payload);
      await fetchLists();
      return newList;
    },
    [fetchLists],
  );

  const deleteList = useCallback(
    async (id: string) => {
      await ShoppingListService.deleteShoppingList(id);
      await fetchLists();
    },
    [fetchLists],
  );

  const changeStatus = useCallback((newStatus: ShoppingListStatus) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  return {
    lists,
    meta,
    status,
    page,
    isLoading,
    error,
    setPage,
    changeStatus,
    createList,
    deleteList,
    refresh: fetchLists,
  };
}
