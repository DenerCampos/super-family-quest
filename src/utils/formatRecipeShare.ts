import type { TFunction } from 'i18next';
import type { RecipeResponse } from '../types/recipe';
import type { ShareTextPayload } from './nativeShare';

export function formatRecipeShare(
  recipe: RecipeResponse,
  t: TFunction,
): ShareTextPayload {
  const title = recipe.title;
  const lines: string[] = [title];

  if (recipe.description?.trim()) {
    lines.push('');
    lines.push(recipe.description.trim());
  }

  lines.push('');
  lines.push(t('recipes.ingredients'));

  if (recipe.ingredients.length === 0) {
    lines.push(t('share.recipe.emptyIngredients'));
  } else {
    for (const ingredient of recipe.ingredients) {
      lines.push(
        t('share.recipe.ingredient', {
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          name: ingredient.name,
        }),
      );
    }
  }

  lines.push('');
  lines.push(t('recipes.instructions'));
  lines.push(
    recipe.instructions?.trim() || t('share.recipe.emptyInstructions'),
  );

  return {
    title,
    text: lines.join('\n'),
  };
}
