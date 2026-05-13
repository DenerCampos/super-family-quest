export type PaginationMeta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PaginationLinks = {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
};

export type ChoreRecurrence = 'once' | 'daily' | 'weekly';

export type ChoreOccurrenceStatusApi =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_APPROVAL'
  | 'COMPLETED'
  | 'REJECTED';

export type ChoreOccurrenceQueryStatusSnake =
  | 'open'
  | 'waiting_approval'
  | 'completed';

export type OwnerResponseDto = {
  id: string;
  name: string;
  profileImage: string | null;
};

export type ChoreDefinitionResponseDto = {
  id: string;
  title: string;
  description: string | null;
  rewardValue: number;
  coinReward: number;
  requirePhoto: boolean;
  recurrence: ChoreRecurrence;
  isActive: boolean;
  createdAt: string;
};

export type ChoreOccurrenceResponseDto = {
  id: string;
  status: ChoreOccurrenceStatusApi;
  snapshotRewardMoney: number | null;
  snapshotCoinReward: number | null;
  photoBeforeUrl: string | null;
  photoAfterUrl: string | null;
  rejectionReason: string | null;
  earnedPeriodYm: number | null;
  submittedAt: string | null;
  approvedAt: string | null;
  completedAt: string | null;
  assignedTo: OwnerResponseDto | null;
  definition: ChoreDefinitionResponseDto;
};

export type CreateChoreDefinitionDto = {
  title: string;
  description?: string;
  rewardValue: number;
  coinReward?: number;
  requirePhoto?: boolean;
  recurrence: ChoreRecurrence;
};

export type UpdateChoreDefinitionDto = {
  title?: string;
  description?: string;
  rewardValue?: number;
  coinReward?: number;
  requirePhoto?: boolean;
  recurrence?: ChoreRecurrence;
  isActive?: boolean;
};

export type ChoreRejectDto = {
  reason: string;
};

export type ChoreSettlePayrollDto = {
  periodYm: number;
};

export type ChorePayrollSuggestionResponseDto = {
  suggestedPeriodYm: number;
  suggestedCloseDate: string;
  message: string;
};

export type ChorePayrollPendingMemberDto = {
  member: OwnerResponseDto;
  totalPending: number;
};

export type ChorePayrollPendingResponseDto = {
  periodYm: number;
  members: ChorePayrollPendingMemberDto[];
  totalPending: number;
};

export type ChorePayrollSettlementResponseDto = {
  id: string;
  periodYm: number;
  settledAt: string;
};

export type PaginatedChoreResponse<T> = {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
};

export type DeleteChoreDefinitionResponseDto = {
  deleted: boolean;
};
