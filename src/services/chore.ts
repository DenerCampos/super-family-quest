import type {
  ChoreDefinitionResponseDto,
  ChoreOccurrenceResponseDto,
  ChoreOccurrenceQueryStatusSnake,
  ChorePayrollPendingMemberDto,
  ChorePayrollPendingResponseDto,
  ChorePayrollSettlementDetailDto,
  ChorePayrollSettlementResponseDto,
  ChorePayrollSuggestionResponseDto,
  CreateChoreDefinitionDto,
  DeleteChoreDefinitionResponseDto,
  ChoreRejectDto,
  ChoreSettlePayrollDto,
  PaginatedChoreResponse,
  UpdateChoreDefinitionDto,
  OwnerResponseDto,
} from '../types/chore';
import api from './api';

const base = (familyGroupId: string) =>
  `/family-groups/${familyGroupId}/chores`;

const parseMoneyField = (value: unknown): number | null => {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const parseOwnerResponseDto = (value: unknown): OwnerResponseDto | null => {
  if (!isRecord(value)) return null;
  const id = value.id;
  const name = value.name;
  if (typeof id !== 'string' || typeof name !== 'string') return null;
  const pi = value.profileImage;
  const profileImage =
    pi === null ? null : typeof pi === 'string' ? pi : null;
  return { id, name, profileImage };
};

const parsePayrollMemberRow = (
  row: unknown,
): ChorePayrollPendingMemberDto | null => {
  if (!isRecord(row)) return null;
  const member = parseOwnerResponseDto(row.member);
  if (!member) return null;
  return {
    member,
    totalPending:
      parseMoneyField(row.totalPending ?? row.total_pending) ?? 0,
  };
};

const normalizePayrollPendingPayload = (
  raw: unknown,
): ChorePayrollPendingResponseDto => {
  if (!isRecord(raw)) {
    return { periodYm: 0, members: [], totalPending: 0 };
  }
  const rawMembers = raw.members;
  const rows = Array.isArray(rawMembers) ? rawMembers : [];
  const members = rows
    .map(parsePayrollMemberRow)
    .filter((m): m is ChorePayrollPendingMemberDto => m !== null);
  const explicitTotal = parseMoneyField(
    raw.totalPending ?? raw.total_pending,
  );
  const totalPending =
    explicitTotal !== null
      ? explicitTotal
      : members.reduce((s, m) => s + m.totalPending, 0);
  const periodRaw = raw.periodYm ?? raw.period_ym;
  const periodYm = Number(periodRaw);
  return {
    periodYm: Number.isFinite(periodYm) ? periodYm : 0,
    members,
    totalPending,
  };
};

const OCCURRENCE_RESOLVE_PAGE = { page: 1, limit: 100 } as const;

export const ChoreService = {
  listDefinitions: async (
    familyGroupId: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<PaginatedChoreResponse<ChoreDefinitionResponseDto>> => {
    const search = new URLSearchParams();
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    const q = search.toString();
    const response = await api.get(
      `${base(familyGroupId)}/definitions${q ? `?${q}` : ''}`,
    );
    return response.data;
  },

  createDefinition: async (
    familyGroupId: string,
    body: CreateChoreDefinitionDto,
  ): Promise<ChoreDefinitionResponseDto> => {
    const response = await api.post(
      `${base(familyGroupId)}/definitions`,
      body,
    );
    return response.data;
  },

  updateDefinition: async (
    familyGroupId: string,
    definitionId: string,
    body: UpdateChoreDefinitionDto,
  ): Promise<ChoreDefinitionResponseDto> => {
    const response = await api.patch(
      `${base(familyGroupId)}/definitions/${definitionId}`,
      body,
    );
    return response.data;
  },

  deleteDefinition: async (
    familyGroupId: string,
    definitionId: string,
  ): Promise<DeleteChoreDefinitionResponseDto> => {
    const response = await api.delete(
      `${base(familyGroupId)}/definitions/${definitionId}`,
    );
    return response.data;
  },

  listOccurrences: async (
    familyGroupId: string,
    params: {
      page?: number;
      limit?: number;
      status?: ChoreOccurrenceQueryStatusSnake;
    } = {},
  ): Promise<PaginatedChoreResponse<ChoreOccurrenceResponseDto>> => {
    const search = new URLSearchParams();
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    if (params.status != null) search.set('status', params.status);
    const q = search.toString();
    const response = await api.get(
      `${base(familyGroupId)}/occurrences${q ? `?${q}` : ''}`,
    );
    return response.data;
  },

  listPendingApproval: async (
    familyGroupId: string,
    params: { page?: number; limit?: number; status?: string } = {},
  ): Promise<PaginatedChoreResponse<ChoreOccurrenceResponseDto>> => {
    const search = new URLSearchParams();
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    if (params.status != null) search.set('status', params.status);
    const q = search.toString();
    const response = await api.get(
      `${base(familyGroupId)}/occurrences/pending-approval${q ? `?${q}` : ''}`,
    );
    return response.data;
  },

  listMine: async (
    familyGroupId: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<PaginatedChoreResponse<ChoreOccurrenceResponseDto>> => {
    const search = new URLSearchParams();
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    const q = search.toString();
    const response = await api.get(
      `${base(familyGroupId)}/occurrences/mine${q ? `?${q}` : ''}`,
    );
    return response.data;
  },

  listHistory: async (
    familyGroupId: string,
    params: {
      page?: number;
      limit?: number;
      year?: number;
      month?: number;
    } = {},
  ): Promise<PaginatedChoreResponse<ChoreOccurrenceResponseDto>> => {
    const search = new URLSearchParams();
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    if (params.year != null) search.set('year', String(params.year));
    if (params.month != null) search.set('month', String(params.month));
    const q = search.toString();
    const response = await api.get(
      `${base(familyGroupId)}/occurrences/history${q ? `?${q}` : ''}`,
    );
    return response.data;
  },

  /**
   * Resolve uma ocorrência consultando listas em sequência (para +1).
   * Evita requisição desnecessária a `history` quando já está em open/mine.
   */
  resolveOccurrence: async (
    familyGroupId: string,
    occurrenceId: string,
  ): Promise<ChoreOccurrenceResponseDto | null> => {
    const open = await ChoreService.listOccurrences(
      familyGroupId,
      OCCURRENCE_RESOLVE_PAGE,
    );
    const fromOpen = open.data.find((o) => o.id === occurrenceId);
    if (fromOpen) return fromOpen;
    const mine = await ChoreService.listMine(
      familyGroupId,
      OCCURRENCE_RESOLVE_PAGE,
    );
    const fromMine = mine.data.find((o) => o.id === occurrenceId);
    if (fromMine) return fromMine;
    const hist = await ChoreService.listHistory(
      familyGroupId,
      OCCURRENCE_RESOLVE_PAGE,
    );
    return hist.data.find((o) => o.id === occurrenceId) ?? null;
  },

  startOccurrence: async (
    familyGroupId: string,
    occurrenceId: string,
  ): Promise<ChoreOccurrenceResponseDto> => {
    const response = await api.patch(
      `${base(familyGroupId)}/occurrences/${occurrenceId}/start`,
    );
    return response.data;
  },

  uploadOccurrencePhotos: async (
    familyGroupId: string,
    occurrenceId: string,
    files: { before?: File; after?: File },
  ): Promise<ChoreOccurrenceResponseDto> => {
    const formData = new FormData();
    if (files.before) formData.append('before', files.before);
    if (files.after) formData.append('after', files.after);
    const response = await api.post(
      `${base(familyGroupId)}/occurrences/${occurrenceId}/photos`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  submitOccurrence: async (
    familyGroupId: string,
    occurrenceId: string,
  ): Promise<ChoreOccurrenceResponseDto> => {
    const response = await api.post(
      `${base(familyGroupId)}/occurrences/${occurrenceId}/submit`,
    );
    return response.data;
  },

  approveOccurrence: async (
    familyGroupId: string,
    occurrenceId: string,
  ): Promise<ChoreOccurrenceResponseDto> => {
    const response = await api.post(
      `${base(familyGroupId)}/occurrences/${occurrenceId}/approve`,
    );
    return response.data;
  },

  rejectOccurrence: async (
    familyGroupId: string,
    occurrenceId: string,
    body: ChoreRejectDto,
  ): Promise<ChoreOccurrenceResponseDto> => {
    const response = await api.post(
      `${base(familyGroupId)}/occurrences/${occurrenceId}/reject`,
      body,
    );
    return response.data;
  },

  returnOccurrenceForAdjustment: async (
    familyGroupId: string,
    occurrenceId: string,
  ): Promise<ChoreOccurrenceResponseDto> => {
    const response = await api.post(
      `${base(familyGroupId)}/occurrences/${occurrenceId}/return-for-adjustment`,
    );
    return response.data;
  },

  getPayrollSuggestion: async (
    familyGroupId: string,
  ): Promise<ChorePayrollSuggestionResponseDto> => {
    const response = await api.get(
      `${base(familyGroupId)}/payroll/suggestion`,
    );
    return response.data;
  },

  getPayrollPending: async (
    familyGroupId: string,
    params: { month?: number; year?: number } = {},
  ): Promise<ChorePayrollPendingResponseDto> => {
    const search = new URLSearchParams();
    if (params.month != null) search.set('month', String(params.month));
    if (params.year != null) search.set('year', String(params.year));
    const q = search.toString();
    const response = await api.get(
      `${base(familyGroupId)}/payroll/pending${q ? `?${q}` : ''}`,
    );
    return normalizePayrollPendingPayload(response.data);
  },

  settlePayroll: async (
    familyGroupId: string,
    body: ChoreSettlePayrollDto,
  ): Promise<ChorePayrollSettlementResponseDto> => {
    const response = await api.post(
      `${base(familyGroupId)}/payroll/settle`,
      body,
    );
    return response.data;
  },

  getPayrollSettlement: async (
    familyGroupId: string,
    params: { month?: number; year?: number } = {},
  ): Promise<ChorePayrollSettlementDetailDto | null> => {
    const search = new URLSearchParams();
    if (params.month != null) search.set('month', String(params.month));
    if (params.year != null) search.set('year', String(params.year));
    const q = search.toString();
    const response = await api.get(
      `${base(familyGroupId)}/payroll/settlements${q ? `?${q}` : ''}`,
    );
    return response.data;
  },

  getPendingCoinRewards: async (
    familyGroupId: string,
  ): Promise<{ totalCoins: number }> => {
    const response = await api.get(
      `${base(familyGroupId)}/coin-rewards/pending`,
    );
    return response.data;
  },

  celebrateCoinRewards: async (
    familyGroupId: string,
  ): Promise<{ totalCoins: number }> => {
    const response = await api.post(
      `${base(familyGroupId)}/coin-rewards/celebrate`,
    );
    return response.data;
  },
};
