import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  collectAdminFamilyMembers,
  isAdminOfAnyFamilyGroup,
} from '../utils/adminFamilyMembers';
import { useFamilyGroup } from './useFamilyGroup';

export const useAdminFamilyMembers = () => {
  const { profile } = useAuth();
  const { familyGroups, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const currentUserId = profile?.user.id ?? '';

  const members = useMemo(
    () => collectAdminFamilyMembers(familyGroups, currentUserId),
    [familyGroups, currentUserId],
  );

  const isAdminAnywhere = useMemo(
    () => isAdminOfAnyFamilyGroup(familyGroups, currentUserId),
    [familyGroups, currentUserId],
  );

  return {
    members,
    isAdminAnywhere,
    isLoadingGroup,
    currentUserId,
  };
};
