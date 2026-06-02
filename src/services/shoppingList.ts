import api from './api';
import type {
  CreateShoppingListPayload,
  CreateShoppingListItemPayload,
  CompleteWithRemainingResponse,
  ItemSuggestionResponse,
  PaginatedResponse,
  ShoppingListDetailResponse,
  ShoppingListItemResponse,
  ShoppingListResponse,
  ShoppingListStatus,
  UpdateShoppingListItemPayload,
  UpdateShoppingListPayload,
} from '../types/shoppingList';

export const ShoppingListService = {
  async getShoppingLists(params?: {
    page?: number;
    limit?: number;
    status?: ShoppingListStatus;
  }): Promise<PaginatedResponse<ShoppingListResponse>> {
    const { data } = await api.get('/shopping-lists', { params });
    return data;
  },

  async createShoppingList(
    payload: CreateShoppingListPayload,
  ): Promise<ShoppingListResponse> {
    const { data } = await api.post('/shopping-lists', payload);
    return data;
  },

  async getShoppingListDetail(
    id: string,
  ): Promise<ShoppingListDetailResponse> {
    const { data } = await api.get(`/shopping-lists/${id}`);
    return data;
  },

  async updateShoppingList(
    id: string,
    payload: UpdateShoppingListPayload,
  ): Promise<ShoppingListResponse> {
    const { data } = await api.patch(`/shopping-lists/${id}`, payload);
    return data;
  },

  async deleteShoppingList(id: string): Promise<{ deleted: boolean }> {
    const { data } = await api.delete(`/shopping-lists/${id}`);
    return data;
  },

  async completeShoppingList(id: string): Promise<ShoppingListResponse> {
    const { data } = await api.patch(`/shopping-lists/${id}/complete`);
    return data;
  },

  async completeShoppingListWithRemaining(
    id: string,
  ): Promise<CompleteWithRemainingResponse> {
    const { data } = await api.patch(
      `/shopping-lists/${id}/complete-with-remaining`,
    );
    return data;
  },

  async recreateShoppingList(id: string): Promise<ShoppingListResponse> {
    const { data } = await api.post(`/shopping-lists/${id}/recreate`);
    return data;
  },

  async addItem(
    listId: string,
    payload: CreateShoppingListItemPayload,
  ): Promise<ShoppingListItemResponse> {
    const { useTextRecognition, ...rest } = payload;
    const { data } = await api.post(`/shopping-lists/${listId}/items`, {
      ...rest,
      useTextRecognition: useTextRecognition ?? false,
    });
    return data;
  },

  async addBulkItems(
    listId: string,
    text: string,
  ): Promise<ShoppingListItemResponse[]> {
    const { data } = await api.post(
      `/shopping-lists/${listId}/items/bulk`,
      { text },
    );
    return data;
  },

  async updateItem(
    itemId: string,
    payload: UpdateShoppingListItemPayload,
  ): Promise<ShoppingListItemResponse> {
    const { data } = await api.patch(
      `/shopping-lists/items/${itemId}`,
      payload,
    );
    return data;
  },

  async toggleItem(itemId: string): Promise<ShoppingListItemResponse> {
    const { data } = await api.patch(
      `/shopping-lists/items/${itemId}/toggle`,
    );
    return data;
  },

  async removeItem(itemId: string): Promise<{ deleted: boolean }> {
    const { data } = await api.delete(`/shopping-lists/items/${itemId}`);
    return data;
  },

  async getSuggestions(search: string): Promise<ItemSuggestionResponse[]> {
    const { data } = await api.get('/shopping-lists/suggestions', {
      params: { search },
    });
    return data;
  },
};
