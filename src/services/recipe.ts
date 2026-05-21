import api from './api';
import type {
  CreateRecipePayload,
  PaginatedRecipesResponse,
  RecipeResponse,
  UpdateRecipePayload,
} from '../types/recipe';
import type { ShoppingListDetailResponse } from '../types/shoppingList';

export const RecipeService = {
  async list(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedRecipesResponse> {
    const { data } = await api.get<PaginatedRecipesResponse>('/recipes', {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<RecipeResponse> {
    const { data } = await api.get<RecipeResponse>(`/recipes/${id}`);
    return data;
  },

  async create(payload: CreateRecipePayload): Promise<RecipeResponse> {
    const { data } = await api.post<RecipeResponse>('/recipes', payload);
    return data;
  },

  async update(
    id: string,
    payload: UpdateRecipePayload,
  ): Promise<RecipeResponse> {
    const { data } = await api.patch<RecipeResponse>(
      `/recipes/${id}`,
      payload,
    );
    return data;
  },

  async remove(id: string): Promise<{ deleted: boolean }> {
    const { data } = await api.delete<{ deleted: boolean }>(
      `/recipes/${id}`,
    );
    return data;
  },

  async uploadPhoto(id: string, file: File): Promise<RecipeResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await api.post<RecipeResponse>(
      `/recipes/${id}/photos`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data;
  },

  async removePhoto(id: string, photoUrl: string): Promise<RecipeResponse> {
    const { data } = await api.delete<RecipeResponse>(
      `/recipes/${id}/photos`,
      {
        data: { photoUrl },
      },
    );
    return data;
  },

  async generateShoppingList(
    id: string,
  ): Promise<ShoppingListDetailResponse> {
    const { data } = await api.post<ShoppingListDetailResponse>(
      `/recipes/${id}/shopping-list`,
    );
    return data;
  },
};
