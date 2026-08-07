import type { FamilyGroupResponseDto } from '../types/familyGroup';

export type FamilyGroupPriorityInput = {
  id: string;
  name: string;
  ownerId: string;
  /** Role do usuário autenticado neste grupo (accepted). */
  viewerRole: 'admin' | 'member';
  joinedAt?: Date | string | null;
};

function roleRank(group: FamilyGroupPriorityInput, userId: string): number {
  if (group.ownerId === userId) return 0;
  if (group.viewerRole === 'admin') return 1;
  return 2;
}

function joinedAtTime(group: FamilyGroupPriorityInput): number {
  if (!group.joinedAt) return Number.MAX_SAFE_INTEGER;
  const t = new Date(group.joinedAt).getTime();
  return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

/** Ordena: owner → admin → member; desempate por joinedAt depois nome. */
export function sortFamilyGroupsByPriority<T extends FamilyGroupPriorityInput>(
  groups: T[],
  userId: string,
): T[] {
  return [...groups].sort((a, b) => {
    const rankDiff = roleRank(a, userId) - roleRank(b, userId);
    if (rankDiff !== 0) return rankDiff;
    const joinedDiff = joinedAtTime(a) - joinedAtTime(b);
    if (joinedDiff !== 0) return joinedDiff;
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

export function pickPrimaryFamilyGroup<T extends FamilyGroupPriorityInput>(
  groups: T[],
  userId: string,
): T | null {
  const sorted = sortFamilyGroupsByPriority(groups, userId);
  return sorted[0] ?? null;
}

export function toFamilyGroupPriorityInput(
  group: FamilyGroupResponseDto,
  userId: string,
): FamilyGroupPriorityInput {
  const membership = group.members.find(
    (m) => m.user?.id === userId && m.status === 'accepted',
  );

  return {
    id: group.id,
    name: group.name,
    ownerId: group.owner.id,
    viewerRole: membership?.role ?? 'member',
    joinedAt: membership?.joinedAt ?? null,
  };
}

/** Ordena DTOs de grupo pela prioridade do viewer. */
export function sortFamilyGroupDtos(
  groups: FamilyGroupResponseDto[],
  userId: string,
): FamilyGroupResponseDto[] {
  if (!userId || groups.length <= 1) return groups;

  const withMeta = groups.map((group) => ({
    ...toFamilyGroupPriorityInput(group, userId),
    group,
  }));

  return sortFamilyGroupsByPriority(withMeta, userId).map((item) => item.group);
}
