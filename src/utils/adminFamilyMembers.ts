import type { FamilyGroupResponseDto } from '../types/familyGroup';
import { isAdmin } from './familyGroupPermissions';

export type AdminFamilyMemberOption = {
  id: string;
  name: string;
};

/**
 * União (por user id) dos membros accepted de todos os grupos em que
 * o usuário atual é admin/owner.
 */
export function collectAdminFamilyMembers(
  familyGroups: FamilyGroupResponseDto[],
  currentUserId: string,
): AdminFamilyMemberOption[] {
  if (!currentUserId) return [];

  const byId = new Map<string, string>();

  for (const group of familyGroups) {
    if (!isAdmin(group, currentUserId)) continue;
    for (const member of group.members) {
      if (member.status !== 'accepted' || !member.user?.id) continue;
      if (!byId.has(member.user.id)) {
        byId.set(member.user.id, member.user.name);
      }
    }
  }

  return Array.from(byId.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export function isAdminOfAnyFamilyGroup(
  familyGroups: FamilyGroupResponseDto[],
  currentUserId: string,
): boolean {
  if (!currentUserId) return false;
  return familyGroups.some((group) => isAdmin(group, currentUserId));
}

/**
 * Preferência: `preferredGroupId` se o usuário for admin nele;
 * senão o primeiro grupo admin da lista (já ordenada por prioridade).
 */
export function pickAdminFamilyGroupId(
  familyGroups: FamilyGroupResponseDto[],
  currentUserId: string,
  preferredGroupId?: string | null,
): string | null {
  if (!currentUserId || familyGroups.length === 0) return null;

  if (preferredGroupId) {
    const preferred = familyGroups.find((g) => g.id === preferredGroupId);
    if (preferred && isAdmin(preferred, currentUserId)) {
      return preferred.id;
    }
  }

  const firstAdmin = familyGroups.find((g) => isAdmin(g, currentUserId));
  return firstAdmin?.id ?? null;
}
