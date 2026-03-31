export type ShoppingListStatus = 'active' | 'completed' | 'archived';
export type ShoppingListItemStatus = 'pending' | 'in_cart';
export type ShoppingListItemUnit = 'un' | 'kg' | 'g' | 'l' | 'ml' | 'pack' | 'dz';

/** Grupo familiar vinculado à lista (lista pessoal quando null). */
export interface ShoppingListFamilyGroup {
  id: string;
  name: string;
}

/** Usuário que criou a lista. */
export interface ShoppingListCreator {
  id: string;
  name: string;
  profileImage: string | null;
}

export interface ShoppingListResponse {
  id: string;
  name: string;
  status: ShoppingListStatus;
  familyGroup: ShoppingListFamilyGroup | null;
  createdBy: ShoppingListCreator | null;
  itemsCount: number;
  pendingCount: number;
  inCartCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Categoria/seção do item na lista (ex.: “Mercearia”). */
export interface ShoppingListItemGroup {
  id: string;
  name: string;
}

export interface ShoppingListItemResponse {
  id: string;
  name: string;
  quantity: number;
  unit: ShoppingListItemUnit;
  status: ShoppingListItemStatus;
  group: ShoppingListItemGroup | null;
  addedBy: ShoppingListCreator | null;
  checkedBy: ShoppingListCreator | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListDetailResponse {
  id: string;
  name: string;
  status: ShoppingListStatus;
  familyGroup: ShoppingListFamilyGroup | null;
  createdBy: ShoppingListCreator | null;
  itemsCount: number;
  pendingCount: number;
  inCartCount: number;
  itemsByCategory: Record<string, ShoppingListItemResponse[]>;
  createdAt: string;
  updatedAt: string;
}

export interface ItemSuggestionResponse {
  name: string;
  suggestedGroup: string | null;
  suggestedUnit: string | null;
  frequency: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string | null;
    next: string | null;
    last: string;
  };
}

export interface CreateShoppingListPayload {
  name: string;
  familyGroupId?: string;
}

export interface UpdateShoppingListPayload {
  name?: string;
  status?: ShoppingListStatus;
}

export interface CreateShoppingListItemPayload {
  name: string;
  quantity?: number;
  unit?: ShoppingListItemUnit;
  groupId?: string;
  useTextRecognition?: boolean;
}

export interface UpdateShoppingListItemPayload {
  name?: string;
  quantity?: number;
  unit?: ShoppingListItemUnit;
  status?: ShoppingListItemStatus;
  groupId?: string;
}

export const UNIT_OPTIONS: { value: ShoppingListItemUnit; label: string }[] = [
  { value: 'un', label: 'Unidade(s)' },
  { value: 'kg', label: 'Kg' },
  { value: 'g', label: 'Gramas' },
  { value: 'l', label: 'Litro(s)' },
  { value: 'ml', label: 'mL' },
  { value: 'pack', label: 'Pacote(s)' },
  { value: 'dz', label: 'Dúzia(s)' },
];
