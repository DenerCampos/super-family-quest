import type {
  FamilyGroupResponseDto,
  FamilyGroupMemberResponseDto,
  FamilyGroupSummaryDto,
  MemberDataDto,
  FamilyMemberRole,
} from '../types/familyGroup';
import api from './api';

export const FamilyGroupService = {
  create: async (name: string): Promise<FamilyGroupResponseDto> => {
    const response = await api.post('/family-group', { name });
    return response.data;
  },

  list: async (): Promise<FamilyGroupResponseDto[]> => {
    const response = await api.get('/family-group');
    return response.data;
  },

  getById: async (id: string): Promise<FamilyGroupResponseDto> => {
    const response = await api.get(`/family-group/${id}`);
    return response.data;
  },

  update: async (id: string, name: string): Promise<FamilyGroupResponseDto> => {
    const response = await api.put(`/family-group/${id}`, { name });
    return response.data;
  },

  delete: async (id: string): Promise<{ deleted: boolean }> => {
    const response = await api.delete(`/family-group/${id}`);
    return response.data;
  },

  invite: async (groupId: string, email: string): Promise<FamilyGroupMemberResponseDto> => {
    const response = await api.post(`/family-group/${groupId}/invite`, { email });
    return response.data;
  },

  listInvitations: async (): Promise<FamilyGroupMemberResponseDto[]> => {
    const response = await api.get('/family-group/invitations');
    return response.data;
  },

  acceptInvitation: async (invitationId: string): Promise<FamilyGroupMemberResponseDto> => {
    const response = await api.patch(`/family-group/invitations/${invitationId}/accept`);
    return response.data;
  },

  rejectInvitation: async (invitationId: string): Promise<FamilyGroupMemberResponseDto> => {
    const response = await api.patch(`/family-group/invitations/${invitationId}/reject`);
    return response.data;
  },

  listMembers: async (groupId: string): Promise<FamilyGroupMemberResponseDto[]> => {
    const response = await api.get(`/family-group/${groupId}/members`);
    return response.data;
  },

  changeRole: async (
    groupId: string,
    memberId: string,
    role: FamilyMemberRole,
  ): Promise<FamilyGroupMemberResponseDto> => {
    const response = await api.patch(`/family-group/${groupId}/members/${memberId}/role`, { role });
    return response.data;
  },

  removeMember: async (groupId: string, memberId: string): Promise<{ deleted: boolean }> => {
    const response = await api.delete(`/family-group/${groupId}/members/${memberId}`);
    return response.data;
  },

  leaveGroup: async (groupId: string): Promise<{ left: boolean }> => {
    const response = await api.delete(`/family-group/${groupId}/leave`);
    return response.data;
  },

  getSummary: async (
    groupId: string,
    month: number,
    year: number,
  ): Promise<FamilyGroupSummaryDto> => {
    const response = await api.get(`/family-group/${groupId}/summary`, {
      params: { month, year },
    });
    return response.data;
  },

  getMemberData: async (
    groupId: string,
    memberId: string,
    month: number,
    year: number,
  ): Promise<MemberDataDto> => {
    const response = await api.get(`/family-group/${groupId}/members/${memberId}/data`, {
      params: { month, year },
    });
    return response.data;
  },
};
