export type FamilyGroupRef = {
  id: string;
  name: string;
} | null | undefined;

export type FamilyGroupSection<T> = {
  key: string;
  familyGroupId: string | null;
  name: string | null;
  items: T[];
};

const PERSONAL_KEY = '__personal__';

/**
 * Agrupa itens por família. Seções de família seguem `familyOrder` (ids);
 * itens sem família vão para a seção pessoal (por último).
 */
export function groupByFamilyGroup<T>(
  items: T[],
  getFamily: (item: T) => FamilyGroupRef,
  familyOrder: { id: string; name: string }[] = [],
): FamilyGroupSection<T>[] {
  const buckets = new Map<string, FamilyGroupSection<T>>();

  const ensure = (
    key: string,
    familyGroupId: string | null,
    name: string | null,
  ) => {
    let section = buckets.get(key);
    if (!section) {
      section = { key, familyGroupId, name, items: [] };
      buckets.set(key, section);
    }
    return section;
  };

  for (const family of familyOrder) {
    ensure(family.id, family.id, family.name);
  }

  for (const item of items) {
    const family = getFamily(item);
    if (family?.id) {
      const section = ensure(family.id, family.id, family.name);
      if (!section.name) section.name = family.name;
      section.items.push(item);
    } else {
      ensure(PERSONAL_KEY, null, null).items.push(item);
    }
  }

  const ordered: FamilyGroupSection<T>[] = [];
  for (const family of familyOrder) {
    const section = buckets.get(family.id);
    if (section && section.items.length > 0) ordered.push(section);
    buckets.delete(family.id);
  }

  for (const [key, section] of buckets) {
    if (key === PERSONAL_KEY || section.items.length === 0) continue;
    ordered.push(section);
  }

  const personal = buckets.get(PERSONAL_KEY);
  if (personal && personal.items.length > 0) {
    ordered.push(personal);
  }

  return ordered;
}
