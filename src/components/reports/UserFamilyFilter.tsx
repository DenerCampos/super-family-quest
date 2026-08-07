import { Select } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type {
  FamilyGroupMemberResponseDto,
  FamilyGroupResponseDto,
} from '../../types/familyGroup';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { sortFamilyGroupDtos } from '../../utils/familyGroupPriority';

interface UserFamilyFilterProps {
  familyGroups: FamilyGroupResponseDto[];
  currentUserId: string;
  selectedFamilyGroupId: string | null;
  selectedUserId: string | null;
  onFamilyChange: (familyGroupId: string | null) => void;
  onUserChange: (userId: string | null) => void;
}

function encodeAll(groupId: string) {
  return `all:${groupId}`;
}

function encodeMe(groupId: string) {
  return `me:${groupId}`;
}

function encodeUser(groupId: string, userId: string) {
  return `user:${groupId}:${userId}`;
}

function visibleMembersOfGroup(
  group: FamilyGroupResponseDto,
  currentUserId: string,
): FamilyGroupMemberResponseDto[] {
  const accepted = group.members.filter(
    (m) => m.status === 'accepted' && m.user,
  );
  if (isAdmin(group, currentUserId)) {
    return accepted;
  }
  return accepted.filter(
    (m) => m.role === 'member' || m.user?.id === currentUserId,
  );
}

function findGroupContainingUser(
  groups: FamilyGroupResponseDto[],
  userId: string,
  preferGroupId?: string | null,
): FamilyGroupResponseDto | null {
  if (preferGroupId) {
    const preferred = groups.find(
      (g) =>
        g.id === preferGroupId &&
        g.members.some(
          (m) => m.status === 'accepted' && m.user?.id === userId,
        ),
    );
    if (preferred) return preferred;
  }
  return (
    groups.find((g) =>
      g.members.some((m) => m.status === 'accepted' && m.user?.id === userId),
    ) ?? null
  );
}

export const UserFamilyFilter = ({
  familyGroups,
  currentUserId,
  selectedFamilyGroupId,
  selectedUserId,
  onFamilyChange,
  onUserChange,
}: UserFamilyFilterProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const sortedGroups = useMemo(
    () => sortFamilyGroupDtos(familyGroups, currentUserId),
    [familyGroups, currentUserId],
  );

  const adminGroups = useMemo(
    () => sortedGroups.filter((g) => isAdmin(g, currentUserId)),
    [sortedGroups, currentUserId],
  );

  /** Membros visíveis de todas as famílias (união), sem depender da família selecionada. */
  const allVisibleMembers = useMemo(() => {
    const byUserId = new Map<
      string,
      { userId: string; name: string; groupId: string }
    >();

    for (const group of sortedGroups) {
      const members = visibleMembersOfGroup(group, currentUserId);
      for (const member of members) {
        const user = member.user;
        if (!user) continue;
        // Prefere grupo onde o viewer é admin ao associar o membro.
        const existing = byUserId.get(user.id);
        if (
          !existing ||
          (isAdmin(group, currentUserId) &&
            !adminGroups.some((g) => g.id === existing.groupId))
        ) {
          byUserId.set(user.id, {
            userId: user.id,
            name: user.name,
            groupId: group.id,
          });
        }
      }
    }

    return [...byUserId.values()].sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR'),
    );
  }, [sortedGroups, currentUserId, adminGroups]);

  const selectedGroup =
    sortedGroups.find((g) => g.id === selectedFamilyGroupId) ??
    sortedGroups[0] ??
    null;

  const userIsAdminOfSelected = selectedGroup
    ? isAdmin(selectedGroup, currentUserId)
    : false;

  const selectValue = (() => {
    if (!selectedGroup) return '';
    if (selectedUserId) {
      if (selectedUserId === currentUserId && !userIsAdminOfSelected) {
        return encodeMe(selectedGroup.id);
      }
      const groupForUser = findGroupContainingUser(
        sortedGroups,
        selectedUserId,
        selectedFamilyGroupId,
      );
      if (groupForUser) {
        return encodeUser(groupForUser.id, selectedUserId);
      }
      return encodeUser(selectedGroup.id, selectedUserId);
    }
    if (userIsAdminOfSelected) return encodeAll(selectedGroup.id);
    return encodeMe(selectedGroup.id);
  })();

  const handleChange = (raw: string) => {
    if (raw.startsWith('all:')) {
      onFamilyChange(raw.slice(4));
      onUserChange(null);
      return;
    }
    if (raw.startsWith('me:')) {
      onFamilyChange(raw.slice(3));
      onUserChange(currentUserId);
      return;
    }
    if (raw.startsWith('user:')) {
      const rest = raw.slice(5);
      const sep = rest.indexOf(':');
      if (sep === -1) return;
      const groupId = rest.slice(0, sep);
      const userId = rest.slice(sep + 1);
      onFamilyChange(groupId);
      onUserChange(userId);
    }
  };

  if (sortedGroups.length === 0) {
    return null;
  }

  const memberOnlyGroups = sortedGroups.filter(
    (g) => !isAdmin(g, currentUserId),
  );
  const showNamedMeForMemberOnly =
    memberOnlyGroups.length > 0 && adminGroups.length === 0;

  return (
    <Select
      value={selectValue}
      onChange={(e) => handleChange(e.target.value)}
      size="sm"
      borderRadius="md"
      fontFamily={getFont('body')}
      color={getColor('text.dashboard.filterLabel')}
      borderColor={getColor('border.dashboard.tile')}
      bg={getColor('background.dashboard.filterBar')}
      width="100%"
    >
      {adminGroups.map((group) => (
        <option key={`all-${group.id}`} value={encodeAll(group.id)}>
          {t('dashboard.filters.allFamilyNamed', { name: group.name })}
        </option>
      ))}

      {showNamedMeForMemberOnly
        ? memberOnlyGroups.map((group) => (
            <option key={`me-${group.id}`} value={encodeMe(group.id)}>
              {t('dashboard.filters.onlyMeNamed', { name: group.name })}
            </option>
          ))
        : null}

      {allVisibleMembers
        .filter((m) => {
          // Em grupos só-membro, "Somente Eu" já vem como me:{group}
          if (showNamedMeForMemberOnly && m.userId === currentUserId) {
            return false;
          }
          return true;
        })
        .map((member) => (
          <option
            key={`${member.groupId}-${member.userId}`}
            value={encodeUser(member.groupId, member.userId)}
          >
            {member.userId === currentUserId
              ? t('dashboard.filters.onlyMe')
              : member.name}
          </option>
        ))}
    </Select>
  );
};
