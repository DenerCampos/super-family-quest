import type {
  HealthExamFilterParams,
  HealthLabItemEvolutionParams,
  HealthLabItemNamesParams,
  HealthOverviewListParams,
  HealthPrescriptionFilterParams,
} from '../types/health';

export const healthQueryKeys = {
  all: (viewerId: string) => ['health', viewerId] as const,
  exams: (viewerId: string, params?: HealthExamFilterParams) =>
    ['health', viewerId, 'exams', params] as const,
  exam: (viewerId: string, id: string) =>
    ['health', viewerId, 'exam', id] as const,
  processing: (viewerId: string) => ['health', viewerId, 'processing'] as const,
  processingItem: (viewerId: string, id: string) =>
    ['health', viewerId, 'processing', id] as const,
  labItemNames: (viewerId: string, params?: HealthLabItemNamesParams) =>
    ['health', viewerId, 'labItemNames', params] as const,
  labItemEvolution: (
    viewerId: string,
    params?: HealthLabItemEvolutionParams,
  ) => ['health', viewerId, 'labItemEvolution', params] as const,
  overview: (viewerId: string, targetUserId?: string) =>
    ['health', viewerId, 'overview', targetUserId ?? 'self'] as const,
  overviewAll: (viewerId: string) => ['health', viewerId, 'overview'] as const,
  overviewList: (viewerId: string, params?: HealthOverviewListParams) =>
    ['health', viewerId, 'overviewList', params] as const,
  overviewItem: (viewerId: string, id: string) =>
    ['health', viewerId, 'overviewItem', id] as const,
  patientContext: (viewerId: string, targetUserId?: string) =>
    ['health', viewerId, 'patientContext', targetUserId ?? 'self'] as const,
  patientContextAll: (viewerId: string) =>
    ['health', viewerId, 'patientContext'] as const,
  latestPatientContext: (viewerId: string, targetUserId?: string) =>
    [
      'health',
      viewerId,
      'latestPatientContext',
      targetUserId ?? 'self',
    ] as const,
  latestPatientContextAll: (viewerId: string) =>
    ['health', viewerId, 'latestPatientContext'] as const,
  prescriptions: (viewerId: string, params?: HealthPrescriptionFilterParams) =>
    ['health', viewerId, 'prescriptions', params] as const,
  prescription: (viewerId: string, id: string) =>
    ['health', viewerId, 'prescription', id] as const,
};
