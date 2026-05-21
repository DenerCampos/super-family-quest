import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RecipeService } from '../services/recipe';
import { recipeQueryKeys } from './recipeQueryKeys';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;

export function useRecipes() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: recipeQueryKeys.list({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    }),
    queryFn: () =>
      RecipeService.list({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
  });

  const createMutation = useMutation({
    mutationFn: RecipeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: RecipeService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
    },
  });

  return {
    recipes: listQuery.data?.data ?? [],
    meta: listQuery.data?.meta,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,
    createRecipe: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteRecipe: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
