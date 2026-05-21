import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm, type Resolver } from 'react-hook-form';
import { useMatch } from 'react-router-dom';
import * as yup from 'yup';
import type { RecipeResponse } from '../types/recipe';
import { RecipeService } from '../services/recipe';
import { recipeQueryKeys } from './recipeQueryKeys';

export interface RecipeIngredientField {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeFormValues {
  title: string;
  description: string;
  instructions: string;
  familyGroupId: string;
  ingredients: RecipeIngredientField[];
}

function buildRecipeSchema(t: (k: string) => string) {
  const ingredientSchema = yup.object({
    name: yup.string().required(t('recipes.ingredientName')),
    quantity: yup
      .number()
      .typeError(t('recipes.ingredientQuantity'))
      .min(0.01, t('recipes.ingredientQuantity'))
      .required(),
    unit: yup.string().required(t('recipes.ingredientUnit')),
  });

  return yup.object({
    title: yup.string().required(t('recipes.fieldTitle')),
    description: yup.string().default(''),
    instructions: yup.string().required(t('recipes.fieldInstructions')),
    familyGroupId: yup.string().default(''),
    ingredients: yup
      .array()
      .of(ingredientSchema)
      .min(1, t('recipes.ingredientsMin'))
      .required(),
  });
}

export function useRecipeForm(t: (k: string) => string) {
  const queryClient = useQueryClient();

  const isNew = Boolean(useMatch('/new-resources/recipes/new'));
  const editMatch = useMatch('/new-resources/recipes/:id/edit');
  const recipeId = editMatch?.params?.id ?? '';

  const schema = useMemo(() => buildRecipeSchema(t), [t]);

  const detailQuery = useQuery({
    queryKey: recipeQueryKeys.detail(recipeId),
    queryFn: () => RecipeService.getById(recipeId),
    enabled: !isNew && Boolean(recipeId),
  });

  const formMethods = useForm<RecipeFormValues>({
    resolver: yupResolver(schema) as Resolver<RecipeFormValues>,
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      familyGroupId: '',
      ingredients: [{ name: '', quantity: 1, unit: 'un' }],
    },
  });

  const { control, reset, handleSubmit } = formMethods;

  const fieldArray = useFieldArray({
    control,
    name: 'ingredients',
  });

  useEffect(() => {
    const r = detailQuery.data;
    if (!r || isNew) return;
    reset({
      title: r.title,
      description: r.description ?? '',
      instructions: r.instructions,
      familyGroupId: r.familyGroup?.id ?? '',
      ingredients:
        r.ingredients?.length > 0
          ? r.ingredients.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              unit: i.unit,
            }))
          : [{ name: '', quantity: 1, unit: 'un' }],
    });
  }, [detailQuery.data, isNew, reset]);

  const createMutation = useMutation({
    mutationFn: RecipeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof RecipeService.update>[1]) =>
      RecipeService.update(recipeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
      queryClient.invalidateQueries({
        queryKey: recipeQueryKeys.detail(recipeId),
      });
    },
  });

  const uploadPhotosMutation = useMutation({
    mutationFn: async ({
      recipe: initial,
      files,
    }: {
      recipe: RecipeResponse;
      files: File[];
    }): Promise<RecipeResponse> => {
      let recipe = initial;
      for (const file of files) {
        recipe = await RecipeService.uploadPhoto(recipe.id, file);
      }
      return recipe;
    },
    onSuccess: (recipe) => {
      queryClient.setQueryData(recipeQueryKeys.detail(recipe.id), recipe);
      queryClient.invalidateQueries({ queryKey: recipeQueryKeys.root });
    },
  });

  const uploadPendingPhotos = async (
    recipe: RecipeResponse,
    files: File[],
    maxPhotos: number,
  ): Promise<RecipeResponse> => {
    const slotsLeft = Math.max(0, maxPhotos - (recipe.photos?.length ?? 0));
    const toUpload = files.slice(0, slotsLeft);
    if (toUpload.length === 0) return recipe;
    return uploadPhotosMutation.mutateAsync({ recipe, files: toUpload });
  };

  const submitRecipe = async (
    values: RecipeFormValues,
  ): Promise<RecipeResponse> => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      instructions: values.instructions.trim(),
      ingredients: values.ingredients.map((i) => ({
        name: i.name.trim(),
        quantity: Number(i.quantity),
        unit: i.unit.trim(),
      })),
      familyGroupId: values.familyGroupId || undefined,
    };

    if (isNew) {
      return createMutation.mutateAsync(payload);
    }

    return updateMutation.mutateAsync({
      title: payload.title,
      description: payload.description,
      instructions: payload.instructions,
      ingredients: payload.ingredients,
    });
  };

  return {
    formMethods,
    fieldArray,
    handleSubmit,
    submitRecipe,
    isNew,
    recipeId,
    recipe: detailQuery.data,
    isLoadingRecipe: detailQuery.isLoading,
    loadError: detailQuery.error,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    uploadPendingPhotos,
    isUploadingPhotos: uploadPhotosMutation.isPending,
  };
}
