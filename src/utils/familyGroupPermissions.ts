import type { FamilyGroupResponseDto } from '../types/familyGroup';

export function isOwner(group: FamilyGroupResponseDto, userId: string): boolean {
  return group.owner.id === userId;
}

export function isAdmin(group: FamilyGroupResponseDto, userId: string): boolean {
  if (isOwner(group, userId)) return true;
  const member = group.members.find((m) => m.user?.id === userId);
  return member?.role === 'admin';
}

export function canViewAllMembers(group: FamilyGroupResponseDto, userId: string): boolean {
  return isAdmin(group, userId);
}

export function canInvite(group: FamilyGroupResponseDto, userId: string): boolean {
  return isAdmin(group, userId);
}

export function canManageRoles(group: FamilyGroupResponseDto, userId: string): boolean {
  return isAdmin(group, userId);
}

export function canDeleteGroup(group: FamilyGroupResponseDto, userId: string): boolean {
  return isOwner(group, userId);
}

export function canLeaveGroup(group: FamilyGroupResponseDto, userId: string): boolean {
  return !isOwner(group, userId);
}
