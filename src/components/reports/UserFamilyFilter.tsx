import { Select } from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { FamilyGroupResponseDto } from '../../types/familyGroup';
import { isAdmin } from '../../utils/familyGroupPermissions';

interface UserFamilyFilterProps {
  familyGroup: FamilyGroupResponseDto;
  currentUserId: string;
  selectedUserId: string | null;
  onUserChange: (userId: string | null) => void;
}

export const UserFamilyFilter = ({
  familyGroup,
  currentUserId,
  selectedUserId,
  onUserChange,
}: UserFamilyFilterProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const userIsAdmin = isAdmin(familyGroup, currentUserId);

  const acceptedMembers = familyGroup.members.filter(
    (m) => m.status === 'accepted' && m.user,
  );

  const visibleMembers = userIsAdmin
    ? acceptedMembers
    : acceptedMembers.filter(
        (m) => m.role === 'member' || m.user?.id === currentUserId,
      );

  return (
    <Select
      value={selectedUserId ?? 'all'}
      onChange={(e) => {
        const val = e.target.value;
        onUserChange(val === 'all' ? null : val);
      }}
      size="sm"
      borderRadius="md"
      fontFamily={getFont('body')}
      color={getColor('text.dashboard.filterLabel')}
      borderColor={getColor('border.dashboard.tile')}
      bg={getColor('background.dashboard.filterBar')}
      width="100%"
    >
      {userIsAdmin && (
        <option value="all">{t('dashboard.filters.allFamily')}</option>
      )}
      {visibleMembers
        .filter((m) => m.user !== null)
        .map((member) => (
          <option key={member.user?.id} value={member.user?.id}>
            {member.user?.id === currentUserId
              ? t('dashboard.filters.onlyMe')
              : member.user?.name}
          </option>
        ))}
    </Select>
  );
};
