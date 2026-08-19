export type FamilyMemberRole = 'admin' | 'member';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export type UserRef = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
};

export type InvitedByRef = {
  id: string;
  name: string;
};

export type FamilyGroupMemberResponseDto = {
  id: string;
  user: UserRef | null;
  invitedEmail: string;
  role: FamilyMemberRole;
  status: InvitationStatus;
  invitedBy: InvitedByRef;
  joinedAt: string | null;
  createdAt: string;
};

export type FamilyGroupResponseDto = {
  id: string;
  name: string;
  /** Brasão do grupo (asset estático). */
  coatOfArms: string;
  /** Foto enviada para o grupo; quando presente, tem prioridade sobre o brasão. */
  groupImage: string | null;
  owner: UserRef;
  members: FamilyGroupMemberResponseDto[];
  createdAt: string;
  updatedAt: string;
};

export type MemberSummary = {
  userId: string;
  name: string;
  profileImage: string | null;
  totalExpenses: number;
  totalRevenues: number;
  masked: boolean;
};

export type FamilyGroupSummaryDto = {
  groupId: string;
  groupName: string;
  totalExpenses: number;
  totalRevenues: number;
  balance: number;
  members: MemberSummary[];
};

export type MemberTransaction = {
  id: string;
  name: string;
  value: number;
  date: string;
};

export type MemberDataDto = {
  userId: string;
  name: string;
  profileImage: string | null;
  totalExpenses: number;
  totalRevenues: number;
  masked: boolean;
  expenses: MemberTransaction[];
  revenues: MemberTransaction[];
};
