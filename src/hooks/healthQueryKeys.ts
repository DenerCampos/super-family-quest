import type {
  HealthExamFilterParams,
  HealthPrescriptionFilterParams,
} from '../types/health';

export const healthQueryKeys = {
  all: (viewerId: string) => ['health', viewerId] as const,
  exams: (viewerId: string, params?: HealthExamFilterParams) =>
    ['health', viewerId, 'exams', params] as const,
  exam: (viewerId: string, id: string) => ['health', viewerId, 'exam', id] as const,
  processing: (viewerId: string) => ['health', viewerId, 'processing'] as const,
  processingItem: (viewerId: string, id: string) =>
    ['health', viewerId, 'processing', id] as const,
  overview: (viewerId: string, targetUserId?: string) =>
    ['health', viewerId, 'overview', targetUserId ?? 'self'] as const,
  overviewAll: (viewerId: string) => ['health', viewerId, 'overview'] as const,
  patientContext: (viewerId: string, targetUserId?: string) =>
    ['health', viewerId, 'patientContext', targetUserId ?? 'self'] as const,
  patientContextAll: (viewerId: string) =>
    ['health', viewerId, 'patientContext'] as const,
  prescriptions: (viewerId: string, params?: HealthPrescriptionFilterParams) =>
    ['health', viewerId, 'prescriptions', params] as const,
  prescription: (viewerId: string, id: string) =>
    ['health', viewerId, 'prescription', id] as const,
};
