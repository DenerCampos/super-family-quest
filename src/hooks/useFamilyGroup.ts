import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services';
import type {
  FamilyGroupResponseDto,
  FamilyGroupSummaryDto,
  MemberDataDto,
  MemberSummary,
} from '../types/familyGroup';

export const useFamilyGroup = () => {
  const [familyGroup, setFamilyGroup] =
    useState<FamilyGroupResponseDto | null>(null);
  const [summary, setSummary] = useState<FamilyGroupSummaryDto | null>(null);
  const [memberData, setMemberData] = useState<MemberDataDto | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingMemberData, setIsLoadingMemberData] = useState(false);

  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const hasGroup = familyGroup !== null;

  const familyMembers: MemberSummary[] = useMemo(
    () => summary?.members ?? [],
    [summary],
  );

  const selectedMember = useMemo(
    () => familyMembers.find((m) => m.userId === selectedMemberId) ?? null,
    [familyMembers, selectedMemberId],
  );

  const loadGroup = useCallback(async () => {
    setIsLoadingGroup(true);
    try {
      const groups = await api.familyGroupList();
      setFamilyGroup(groups.length > 0 ? groups[0] : null);
    } catch {
      setFamilyGroup(null);
    } finally {
      setIsLoadingGroup(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    if (!familyGroup) return;
    setIsLoadingSummary(true);
    try {
      const data = await api.familyGroupGetSummary(
        familyGroup.id,
        month,
        year,
      );
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [familyGroup, month, year]);

  const loadMemberData = useCallback(
    async (memberId: string) => {
      if (!familyGroup) return;
      setIsLoadingMemberData(true);
      try {
        const data = await api.familyGroupGetMemberData(
          familyGroup.id,
          memberId,
          month,
          year,
        );
        setMemberData(data);
      } catch {
        setMemberData(null);
      } finally {
        setIsLoadingMemberData(false);
      }
    },
    [familyGroup, month, year],
  );

  const loadPendingCount = useCallback(async () => {
    try {
      const invitations = await api.familyGroupListInvitations();
      setPendingCount(invitations.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    loadGroup();
    loadPendingCount();
  }, [loadGroup, loadPendingCount]);

  useEffect(() => {
    if (familyGroup) {
      loadSummary();
    }
  }, [familyGroup, loadSummary]);

  useEffect(() => {
    if (selectedMemberId && familyGroup) {
      loadMemberData(selectedMemberId);
    } else {
      setMemberData(null);
    }
  }, [selectedMemberId, familyGroup, loadMemberData]);

  return {
    familyGroup,
    summary,
    memberData,
    selectedMemberId,
    setSelectedMemberId,
    pendingCount,
    isLoadingGroup,
    isLoadingSummary,
    isLoadingMemberData,
    month,
    year,
    setMonth,
    setYear,
    hasGroup,
    familyMembers,
    selectedMember,
    loadGroup,
    loadSummary,
    loadPendingCount,
  };
};
