export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeFamilyGroup {
  id: string;
  name: string;
}

export interface RecipeCreator {
  id: string;
  name: string;
  profileImage: string | null;
}

export interface RecipeResponse {
  id: string;
  title: string;
  description: string | null;
  ingredients: RecipeIngredient[];
  instructions: string;
  photos: string[];
  familyGroup: RecipeFamilyGroup | null;
  createdBy: RecipeCreator | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRecipesResponse {
  data: RecipeResponse[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: Record<string, unknown>;
}

export interface CreateRecipePayload {
  title: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  familyGroupId?: string;
}

export type UpdateRecipePayload = Partial<
  Omit<CreateRecipePayload, 'familyGroupId'>
>;
