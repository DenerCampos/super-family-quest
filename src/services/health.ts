import api from './api';
import type {
  CreateHealthExamPayload,
  CreatePatientContextPayload,
  CreatePrescriptionPayload,
  ExtractedPrescriptionData,
  GenerateOverviewPayload,
  HealthAiOverviewDto,
  HealthExamDto,
  HealthExamEvolutionPointDto,
  HealthExamFilterParams,
  HealthExamProcessingDto,
  HealthLabItemEvolutionParams,
  HealthLabItemNamesParams,
  HealthOverviewListParams,
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

const listLabItemNames = async (
  params: HealthLabItemNamesParams = {},
): Promise<string[]> => {
  const { data } = await api.get<string[]>('/health/exam-items/names', {
    params,
  });
  return data;
};

const getLabItemEvolution = async (
  params: HealthLabItemEvolutionParams,
): Promise<HealthExamEvolutionPointDto[]> => {
  const { data } = await api.get<HealthExamEvolutionPointDto[]>(
    '/health/exam-items/evolution',
    { params },
  );
  return data;
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

const getLatestPatientContext = async (
  targetUserId?: string,
): Promise<HealthPatientContextDto | null> => {
  const params = targetUserId ? { targetUserId } : {};
  const { data } = await api.get<HealthPatientContextDto | null>(
    '/health/patient-context/latest',
    { params },
  );
  return data;
};

const createPatientContext = async (
  payload: CreatePatientContextPayload,
): Promise<HealthPatientContextDto> => {
  const { data } = await api.post<HealthPatientContextDto>(
    '/health/patient-context',
    payload,
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

const listOverviews = async (
  params: HealthOverviewListParams = {},
): Promise<HealthAiOverviewDto[]> => {
  const { data } = await api.get<HealthAiOverviewDto[]>('/health/ai-overview', {
    params,
  });
  return data;
};

const getOverviewById = async (
  id: string,
): Promise<HealthAiOverviewDto> => {
  const { data } = await api.get<HealthAiOverviewDto>(
    `/health/ai-overview/${id}`,
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
  listLabItemNames,
  getLabItemEvolution,
  uploadFiles,
  listProcessing,
  getProcessingById,
  approveProcessing,
  discardProcessing,
  retryProcessing,
  generateOverview,
  getLatestOverview,
  listOverviews,
  getOverviewById,
  listPatientContext,
  getLatestPatientContext,
  createPatientContext,
  createPrescription,
  listPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  analyzePrescription,
};
