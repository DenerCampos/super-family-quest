import type { TFunction } from 'i18next';
import type {
  ShoppingListDetailResponse,
  ShoppingListItemResponse,
} from '../types/shoppingList';
import { formatShoppingListUnit } from './formatShoppingListUnit';
import type { ShareTextPayload } from './nativeShare';

export function flattenShoppingListItems(
  itemsByCategory: Record<string, ShoppingListItemResponse[]>,
): ShoppingListItemResponse[] {
  return Object.values(itemsByCategory).flat();
}

export function formatShoppingListShare(
  detail: ShoppingListDetailResponse,
  t: TFunction,
): ShareTextPayload {
  const title = t('share.shoppingList.title', { name: detail.name });
  const items = flattenShoppingListItems(detail.itemsByCategory);

  if (items.length === 0) {
    return {
      title,
      text: `${title}\n\n${t('share.shoppingList.empty')}`,
    };
  }

  const lines = items.map((item) => {
    const key =
      item.status === 'in_cart'
        ? 'share.shoppingList.itemInCart'
        : 'share.shoppingList.itemPending';

    return t(key, {
      quantity: item.quantity,
      unit: formatShoppingListUnit(item.unit),
      name: item.name,
    });
  });

  return {
    title,
    text: `${title}\n\n${lines.join('\n')}`,
  };
}
