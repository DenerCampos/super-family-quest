import { useState } from 'react';
import {
  VStack,
  Text,
  Flex,
  Button,
  Avatar,
  Badge,
  Box,
  useDisclosure,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FiUserPlus, FiTrash2, FiLogOut } from 'react-icons/fi';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services';
import type { FamilyGroupResponseDto } from '../../types/familyGroup';
import {
  isOwner,
  canInvite,
  canManageRoles,
  canDeleteGroup,
  canLeaveGroup,
} from '../../utils/familyGroupPermissions';
import { InviteMemberModal } from './InviteMemberModal';

type FamilyManagementProps = {
  group: FamilyGroupResponseDto;
  onRefresh: () => void;
};

export const FamilyManagement = ({ group, onRefresh }: FamilyManagementProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const currentUserId = profile?.user.id || '';
  const userIsAdmin = canInvite(group, currentUserId);

  const acceptedMembers = group.members.filter((m) => m.status === 'accepted');
  const pendingMembers = group.members.filter((m) => m.status === 'pending');

  const handleChangeRole = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    setProcessingId(memberId);
    try {
      await api.familyGroupChangeRole(group.id, memberId, newRole as 'admin' | 'member');
      toast({
        title: t('common.success'),
        description: t('familyGroup.roleChanged'),
        status: 'success',
        duration: 3000,
      });
      onRefresh();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.roleChangeError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm(t('familyGroup.removeMemberConfirm'))) return;

    setProcessingId(memberId);
    try {
      await api.familyGroupRemoveMember(group.id, memberId);
      toast({
        title: t('common.success'),
        description: t('familyGroup.memberRemoved'),
        status: 'success',
        duration: 3000,
      });
      onRefresh();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.removeMemberError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm(t('familyGroup.leaveGroupConfirm'))) return;

    try {
      await api.familyGroupLeave(group.id);
      toast({
        title: t('common.success'),
        description: t('familyGroup.leftGroup'),
        status: 'success',
        duration: 3000,
      });
      onRefresh();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.leaveGroupError'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm(t('familyGroup.deleteGroupConfirm'))) return;

    try {
      await api.familyGroupDelete(group.id);
      toast({
        title: t('common.success'),
        description: t('familyGroup.groupDeleted'),
        status: 'success',
        duration: 3000,
      });
      onRefresh();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.deleteGroupError'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getRoleLabel = (memberId: string, role: string) => {
    if (isOwner(group, memberId)) return t('familyGroup.owner');
    if (role === 'admin') return t('familyGroup.admin');
    return t('familyGroup.member');
  };

  const getRoleColor = (memberId: string, role: string) => {
    if (isOwner(group, memberId)) return 'purple';
    if (role === 'admin') return 'blue';
    return 'gray';
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      {userIsAdmin && (
        <Button
          leftIcon={<FiUserPlus />}
          bg={getColor('button.background.neutral')}
          color={getColor('button.text.primary')}
          _hover={{ opacity: 0.8 }}
          onClick={onOpen}
          fontFamily={getFont('body')}
          size="sm"
        >
          {t('familyGroup.invite')}
        </Button>
      )}

      <Text
        fontSize="md"
        fontWeight="bold"
        color={getColor('text.familyGroup.title')}
        fontFamily={getFont('heading')}
      >
        {t('familyGroup.members')} ({acceptedMembers.length + 1})
      </Text>

      {/* Owner */}
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
        <Badge colorScheme="purple" fontFamily={getFont('body')}>{t('familyGroup.owner')}</Badge>
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
                colorScheme={getRoleColor(memberUserId, member.role)}
                fontFamily={getFont('body')}
                cursor={canManageRoles(group, currentUserId) && !memberIsOwner ? 'pointer' : 'default'}
                onClick={() => {
                  if (canManageRoles(group, currentUserId) && !memberIsOwner) {
                    handleChangeRole(member.id, member.role);
                  }
                }}
              >
                {getRoleLabel(memberUserId, member.role)}
              </Badge>
              {canManageRoles(group, currentUserId) && !memberIsOwner && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  isLoading={processingId === member.id}
                  onClick={() => handleRemoveMember(member.id)}
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
              <Badge colorScheme="yellow" fontFamily={getFont('body')}>
                {t('familyGroup.pending')}
              </Badge>
            </Flex>
          ))}
        </>
      )}

      <Divider my={2} />

      {canLeaveGroup(group, currentUserId) && (
        <Button
          leftIcon={<FiLogOut />}
          variant="outline"
          colorScheme="orange"
          size="sm"
          onClick={handleLeaveGroup}
          fontFamily={getFont('body')}
        >
          {t('familyGroup.leaveGroup')}
        </Button>
      )}

      {canDeleteGroup(group, currentUserId) && (
        <Button
          leftIcon={<FiTrash2 />}
          variant="outline"
          colorScheme="red"
          size="sm"
          onClick={handleDeleteGroup}
          fontFamily={getFont('body')}
        >
          {t('familyGroup.deleteGroup')}
        </Button>
      )}

      <InviteMemberModal
        isOpen={isOpen}
        onClose={onClose}
        groupId={group.id}
        onInviteSent={onRefresh}
      />
    </VStack>
  );
};
