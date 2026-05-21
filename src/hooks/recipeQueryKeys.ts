export const recipeQueryKeys = {
  root: ['recipes'] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...recipeQueryKeys.root, 'list', params] as const,
  detail: (id: string) => [...recipeQueryKeys.root, 'detail', id] as const,
};
