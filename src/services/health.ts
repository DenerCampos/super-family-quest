import api from './api';
import type {
  CreateHealthExamPayload,
  CreatePrescriptionPayload,
  ExtractedPrescriptionData,
  GenerateOverviewPayload,
  HealthAiOverviewDto,
  HealthExamDto,
  HealthExamFilterParams,
  HealthExamProcessingDto,
  HealthPatientContextDto,
  HealthPrescriptionDto,
  HealthPrescriptionFilterParams,
} from '../types/health';

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

// ─── Exames ──────────────────────────────────────────────────────────────────

const createExam = async (
  payload: CreateHealthExamPayload,
): Promise<HealthExamDto> => {
  const { data } = await api.post<HealthExamDto>('/health/exams', payload);
  return data;
};

const listExams = async (
  params: HealthExamFilterParams = {},
): Promise<PaginatedResponse<HealthExamDto>> => {
  const { data } = await api.get<PaginatedResponse<HealthExamDto>>(
    '/health/exams',
    { params },
  );
  return data;
};

const getExamById = async (id: string): Promise<HealthExamDto> => {
  const { data } = await api.get<HealthExamDto>(`/health/exams/${id}`);
  return data;
};

const updateExam = async (
  id: string,
  payload: Partial<CreateHealthExamPayload>,
): Promise<HealthExamDto> => {
  const { data } = await api.put<HealthExamDto>(`/health/exams/${id}`, payload);
  return data;
};

const deleteExam = async (id: string): Promise<void> => {
  await api.delete(`/health/exams/${id}`);
};

// ─── Upload / Processamento ───────────────────────────────────────────────────

const uploadFiles = async (
  files: File[],
  targetUserId?: string,
): Promise<HealthExamProcessingDto[]> => {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  if (targetUserId) {
    form.append('targetUserId', targetUserId);
  }
  const { data } = await api.post<HealthExamProcessingDto[]>(
    '/health/upload',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

const listProcessing = async (): Promise<HealthExamProcessingDto[]> => {
  const { data } = await api.get<HealthExamProcessingDto[]>('/health/processing');
  return data;
};

const getProcessingById = async (
  id: string,
): Promise<HealthExamProcessingDto> => {
  const { data } = await api.get<HealthExamProcessingDto>(
    `/health/processing/${id}`,
  );
  return data;
};

const approveProcessing = async (
  id: string,
  payload: Partial<CreateHealthExamPayload>,
): Promise<HealthExamDto> => {
  const { data } = await api.post<HealthExamDto>(
    `/health/processing/${id}/approve`,
    payload,
  );
  return data;
};

const discardProcessing = async (id: string): Promise<void> => {
  await api.delete(`/health/processing/${id}`);
};

const retryProcessing = async (id: string): Promise<HealthExamProcessingDto> => {
  const { data } = await api.post<HealthExamProcessingDto>(
    `/health/processing/${id}/retry`,
  );
  return data;
};

// ─── Visão Geral ─────────────────────────────────────────────────────────────

const generateOverview = async (
  payload: GenerateOverviewPayload = {},
): Promise<HealthAiOverviewDto> => {
  const { data } = await api.post<HealthAiOverviewDto>('/health/ai-overview', payload);
  return data;
};

const listPatientContext = async (
  targetUserId?: string,
): Promise<HealthPatientContextDto[]> => {
  const params = targetUserId ? { targetUserId } : {};
  const { data } = await api.get<HealthPatientContextDto[]>(
    '/health/patient-context',
    { params },
  );
  return data;
};

const getLatestOverview = async (
  targetUserId?: string,
): Promise<HealthAiOverviewDto | null> => {
  const params = targetUserId ? { targetUserId } : {};
  const { data } = await api.get<HealthAiOverviewDto | null>(
    '/health/ai-overview/latest',
    { params },
  );
  return data;
};

// ─── Receituário ──────────────────────────────────────────────────────────────

const createPrescription = async (
  payload: CreatePrescriptionPayload,
): Promise<HealthPrescriptionDto> => {
  const { data } = await api.post<HealthPrescriptionDto>(
    '/health/prescriptions',
    payload,
  );
  return data;
};

const listPrescriptions = async (params?: HealthPrescriptionFilterParams): Promise<PaginatedResponse<HealthPrescriptionDto>> => {
  const { data } = await api.get<PaginatedResponse<HealthPrescriptionDto>>(
    '/health/prescriptions',
    { params },
  );
  return data;
};

const getPrescriptionById = async (
  id: string,
): Promise<HealthPrescriptionDto> => {
  const { data } = await api.get<HealthPrescriptionDto>(
    `/health/prescriptions/${id}`,
  );
  return data;
};

const updatePrescription = async (
  id: string,
  payload: Partial<CreatePrescriptionPayload>,
): Promise<HealthPrescriptionDto> => {
  const { data } = await api.put<HealthPrescriptionDto>(
    `/health/prescriptions/${id}`,
    payload,
  );
  return data;
};

const deletePrescription = async (id: string): Promise<void> => {
  await api.delete(`/health/prescriptions/${id}`);
};

const analyzePrescription = async (
  file: File,
): Promise<ExtractedPrescriptionData> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<ExtractedPrescriptionData>(
    '/health/prescriptions/analyze',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

export const HealthService = {
  createExam,
  listExams,
  getExamById,
  updateExam,
  deleteExam,
  uploadFiles,
  listProcessing,
  getProcessingById,
  approveProcessing,
  discardProcessing,
  retryProcessing,
  generateOverview,
  getLatestOverview,
  listPatientContext,
  createPrescription,
  listPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  analyzePrescription,
};
