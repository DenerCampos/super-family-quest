import type { ShoppingListItemUnit } from '../types/shoppingList';

const SHORT_UNITS: Record<ShoppingListItemUnit, string> = {
  un: 'un',
  kg: 'kg',
  g: 'g',
  l: 'L',
  ml: 'ml',
  pack: 'pct',
  dz: 'dz',
};

export function formatShoppingListUnit(unit: ShoppingListItemUnit): string {
  return SHORT_UNITS[unit] || unit;
}
