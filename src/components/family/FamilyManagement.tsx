import { useState } from 'react';
import {
  VStack,
  Button,
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
import { canInvite, canDeleteGroup, canLeaveGroup } from '../../utils/familyGroupPermissions';
import { InviteMemberModal } from './InviteMemberModal';
import { MembersList } from './MembersList';
import { ConfirmActionDialog } from './ConfirmActionDialog';

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
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const currentUserId = profile?.user.id || '';
  const userIsAdmin = canInvite(group, currentUserId);

  const handleChangeRole = async (memberId: string, currentRole: string) => {
    const newRole: 'admin' | 'member' = currentRole === 'admin' ? 'member' : 'admin';
    setProcessingId(memberId);
    try {
      await api.familyGroupChangeRole(group.id, memberId, newRole);
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

  const handleRemoveMember = (memberId: string) => {
    setConfirmDialog({
      message: t('familyGroup.removeMemberConfirm'),
      onConfirm: async () => {
        setConfirmDialog(null);
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
      },
    });
  };

  const handleLeaveGroup = () => {
    setConfirmDialog({
      message: t('familyGroup.leaveGroupConfirm'),
      onConfirm: async () => {
        setConfirmDialog(null);
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
      },
    });
  };

  const handleDeleteGroup = () => {
    setConfirmDialog({
      message: t('familyGroup.deleteGroupConfirm'),
      onConfirm: async () => {
        setConfirmDialog(null);
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
      },
    });
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

      <MembersList
        group={group}
        currentUserId={currentUserId}
        processingId={processingId}
        onChangeRole={handleChangeRole}
        onRemoveMember={handleRemoveMember}
      />

      <Divider my={2} />

      {canLeaveGroup(group, currentUserId) && (
        <Button
          leftIcon={<FiLogOut />}
          variant="outline"
          color={getColor('status.warning')}
          borderColor={getColor('status.warning')}
          _hover={{ bg: getColor('background.familyGroup.badge.pending') }}
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
          color={getColor('status.error')}
          borderColor={getColor('status.error')}
          _hover={{ bg: getColor('background.lastRegistrations.expense') }}
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

      <ConfirmActionDialog
        isOpen={!!confirmDialog}
        message={confirmDialog?.message ?? ''}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => confirmDialog?.onConfirm()}
      />
    </VStack>
  );
};
