import {
  Text,
  Flex,
  Button,
  Avatar,
  Badge,
  Box,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { FamilyGroupResponseDto } from '../../types/familyGroup';
import { isOwner, canManageRoles } from '../../utils/familyGroupPermissions';

type MembersListProps = {
  group: FamilyGroupResponseDto;
  currentUserId: string;
  processingId: string | null;
  onChangeRole: (memberId: string, currentRole: string) => void;
  onRemoveMember: (memberId: string) => void;
};

export const MembersList = ({
  group,
  currentUserId,
  processingId,
  onChangeRole,
  onRemoveMember,
}: MembersListProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const acceptedMembers = group.members.filter((m) => m.status === 'accepted');
  const pendingMembers = group.members.filter((m) => m.status === 'pending');

  const getRoleLabel = (memberId: string, role: string) => {
    if (isOwner(group, memberId)) return t('familyGroup.owner');
    if (role === 'admin') return t('familyGroup.admin');
    return t('familyGroup.member');
  };

  const getRoleBadgeColors = (memberId: string, role: string) => {
    if (isOwner(group, memberId)) {
      return {
        bg: getColor('background.familyGroup.badge.owner'),
        color: getColor('text.familyGroup.badge.owner'),
      };
    }
    if (role === 'admin') {
      return {
        bg: getColor('background.familyGroup.badge.admin'),
        color: getColor('text.familyGroup.badge.admin'),
      };
    }
    return {
      bg: getColor('background.familyGroup.badge.member'),
      color: getColor('text.familyGroup.badge.member'),
    };
  };

  return (
    <>
      <Text
        fontSize="md"
        fontWeight="bold"
        color={getColor('text.familyGroup.title')}
        fontFamily={getFont('heading')}
      >
        {t('familyGroup.members')} ({acceptedMembers.length + 1})
      </Text>

      <Flex
        align="center"
        justify="space-between"
        p={3}
        bg={getColor('background.familyGroup.memberCard')}
        borderRadius="md"
      >
        <Flex align="center" gap={3}>
          <Avatar
            size="sm"
            name={group.owner.name}
            src={group.owner.profileImage || undefined}
          />
          <Box>
            <Text fontSize="sm" fontWeight="bold" fontFamily={getFont('body')} color={getColor('text.familyGroup.primary')}>
              {group.owner.name}
            </Text>
            <Text fontSize="xs" color={getColor('text.familyGroup.secondary')}>{group.owner.email}</Text>
          </Box>
        </Flex>
        <Badge
          bg={getColor('background.familyGroup.badge.owner')}
          color={getColor('text.familyGroup.badge.owner')}
          fontFamily={getFont('body')}
        >
          {t('familyGroup.owner')}
        </Badge>
      </Flex>

      {acceptedMembers.map((member) => {
        const memberUserId = member.user?.id || '';
        const memberIsOwner = isOwner(group, memberUserId);

        return (
          <Flex
            key={member.id}
            align="center"
            justify="space-between"
            p={3}
            bg={getColor('background.familyGroup.memberCard')}
            borderRadius="md"
          >
            <Flex align="center" gap={3}>
              <Avatar
                size="sm"
                name={member.user?.name || member.invitedEmail}
                src={member.user?.profileImage || undefined}
              />
              <Box>
                <Text fontSize="sm" fontWeight="bold" fontFamily={getFont('body')} color={getColor('text.familyGroup.primary')}>
                  {member.user?.name || member.invitedEmail}
                </Text>
                <Text fontSize="xs" color={getColor('text.familyGroup.secondary')}>
                  {member.user?.email || member.invitedEmail}
                </Text>
              </Box>
            </Flex>
            <Flex align="center" gap={2}>
              <Badge
                {...getRoleBadgeColors(memberUserId, member.role)}
                fontFamily={getFont('body')}
                cursor={canManageRoles(group, currentUserId) && !memberIsOwner ? 'pointer' : 'default'}
                onClick={() => {
                  if (canManageRoles(group, currentUserId) && !memberIsOwner) {
                    onChangeRole(member.id, member.role);
                  }
                }}
              >
                {getRoleLabel(memberUserId, member.role)}
              </Badge>
              {canManageRoles(group, currentUserId) && !memberIsOwner && (
                <Button
                  size="xs"
                  variant="ghost"
                  color={getColor('status.error')}
                  _hover={{ bg: getColor('background.lastRegistrations.expense') }}
                  isLoading={processingId === member.id}
                  onClick={() => onRemoveMember(member.id)}
                >
                  <FiTrash2 />
                </Button>
              )}
            </Flex>
          </Flex>
        );
      })}

      {pendingMembers.length > 0 && (
        <>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={getColor('text.familyGroup.secondary')}
            fontFamily={getFont('heading')}
            mt={2}
          >
            {t('familyGroup.pending')} ({pendingMembers.length})
          </Text>
          {pendingMembers.map((member) => (
            <Flex
              key={member.id}
              align="center"
              justify="space-between"
              p={3}
              bg={getColor('background.familyGroup.memberCard')}
              borderRadius="md"
              opacity={0.7}
            >
              <Flex align="center" gap={3}>
                <Avatar size="sm" name={member.invitedEmail} />
                <Text fontSize="sm" fontFamily={getFont('body')} color={getColor('text.familyGroup.primary')}>
                  {member.invitedEmail}
                </Text>
              </Flex>
              <Badge
                bg={getColor('background.familyGroup.badge.pending')}
                color={getColor('text.familyGroup.badge.pending')}
                fontFamily={getFont('body')}
              >
                {t('familyGroup.pending')}
              </Badge>
            </Flex>
          ))}
        </>
      )}
    </>
  );
};
