import type { HealthExamType, HealthProcessingStatus } from '../types/health';

/** Limite de 10 MB por arquivo de exame (PDF/imagem). */
export const HEALTH_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const HEALTH_EXAM_TYPE_VALUES: HealthExamType[] = [
  'LABORATORY',
  'IMAGING',
  'FUNCTIONAL',
  'PROCEDURE',
  'OTHER',
];

export const HEALTH_DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export type HealthDayKey = (typeof HEALTH_DAY_KEYS)[number];

export function getHealthExamTypeOptions(t: (key: string) => string) {
  return HEALTH_EXAM_TYPE_VALUES.map((value) => ({
    value,
    label: t(`health.examTypes.${value}`),
  }));
}

export function getHealthExamTypeFilterOptions(t: (key: string) => string) {
  return [
    { value: '' as const, label: t('health.search.allTypes') },
    ...getHealthExamTypeOptions(t),
  ];
}

export function getHealthDayOptions(t: (key: string) => string) {
  return HEALTH_DAY_KEYS.map((key) => ({
    key,
    label: t(`health.daysOfWeek.${key}`),
  }));
}

export function getHealthDayLabel(
  t: (key: string) => string,
  dayKey: string,
): string {
  const key = `health.daysOfWeek.${dayKey}`;
  const translated = t(key);
  return translated === key ? dayKey : translated;
}

const PROCESSING_STATUS_COLOR: Record<HealthProcessingStatus, string> = {
  QUEUED: 'status.warning',
  PROCESSING: 'status.info',
  COMPLETED: 'status.success',
  FAILED: 'status.error',
};

export function getProcessingStatusColor(
  status: HealthProcessingStatus,
  getColor: (token: string) => string,
): string {
  return getColor(PROCESSING_STATUS_COLOR[status]);
}

export const HEALTH_ALLOWED_UPLOAD_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export const HEALTH_ALLOWED_UPLOAD_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

export const HEALTH_UPLOAD_ACCEPT_ATTR = 'application/pdf,image/jpeg,image/png';
