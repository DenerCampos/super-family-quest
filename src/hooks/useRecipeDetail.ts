import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RecipeService } from '../services/recipe';
import { recipeQueryKeys } from './recipeQueryKeys';
import type { UpdateRecipePayload } from '../types/recipe';

export function useRecipeDetail(recipeId: string | undefined) {
  const queryClient = useQueryClient();
  const id = recipeId ?? '';

  const detailQuery = useQuery({
    queryKey: recipeQueryKeys.detail(id),
    queryFn: () => RecipeService.getById(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: UpdateRecipePayload;
    }) => RecipeService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => RecipeService.uploadPhoto(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
    },
  });

  const removePhotoMutation = useMutation({
    mutationFn: (photoUrl: string) =>
      RecipeService.removePhoto(id, photoUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
    },
  });

  const generateShoppingListMutation = useMutation({
    mutationFn: () => RecipeService.generateShoppingList(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => RecipeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
      queryClient.removeQueries({ queryKey: recipeQueryKeys.detail(id) });
    },
  });

  return {
    recipe: detailQuery.data,
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    updateRecipe: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    uploadPhoto: uploadPhotoMutation.mutateAsync,
    isUploadingPhoto: uploadPhotoMutation.isPending,
    removePhoto: removePhotoMutation.mutateAsync,
    isRemovingPhoto: removePhotoMutation.isPending,
    generateShoppingList: generateShoppingListMutation.mutateAsync,
    isGeneratingList: generateShoppingListMutation.isPending,
    deleteRecipe: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
