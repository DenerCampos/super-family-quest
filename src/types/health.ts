export type HealthExamType =
  | 'LABORATORY'
  | 'IMAGING'
  | 'FUNCTIONAL'
  | 'PROCEDURE'
  | 'OTHER';

export type HealthSourceType = 'MANUAL' | 'PDF' | 'IMAGE_FILE';

export type HealthExamStatus = 'PENDING_REVIEW' | 'APPROVED';

export type HealthFileType = 'PDF' | 'IMAGE';

export type HealthProcessingStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export interface HealthExamItemDto {
  id: string;
  itemName: string;
  material?: string | null;
  method?: string | null;
  resultValue?: string | null;
  resultUnit?: string | null;
  referenceRange?: string | null;
  isAbnormal: boolean;
  itemNotes?: string | null;
  findings?: string | null;
  conclusion?: string | null;
  createdAt: string;
}

export interface HealthExamFileDto {
  id: string;
  fileUrl: string;
  fileType: HealthFileType;
  originalFilename?: string | null;
  pageCount?: number | null;
  createdAt: string;
}

export interface HealthExamDto {
  id: string;
  labName?: string | null;
  doctorName?: string | null;
  examDate?: string | null;
  examType: HealthExamType;
  sourceType: HealthSourceType;
  status: HealthExamStatus;
  notes?: string | null;
  items: HealthExamItemDto[];
  files: HealthExamFileDto[];
  user: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface HealthExamProcessingDto {
  id: string;
  fileUrl: string;
  fileType: HealthFileType;
  originalFilename?: string | null;
  totalPages: number;
  status: HealthProcessingStatus;
  extractedData?: ExtractedExamData | null;
  errorMessage?: string | null;
  failedAt?: string | null;
  retryCount?: number;
  targetUser: { id: string; name: string };
  uploadedBy: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface ExtractedExamData {
  labName?: string | null;
  doctorName?: string | null;
  examDate?: string | null;
  examType?: HealthExamType;
  notes?: string | null;
  items: ExtractedExamItem[];
}

export interface HealthPrescriptionFilterParams {
  userId?: string;
  page?: number;
  limit?: number;
}

export interface ExtractedExamItem {
  itemName: string;
  material?: string | null;
  method?: string | null;
  resultValue?: string | null;
  resultUnit?: string | null;
  referenceRange?: string | null;
  isAbnormal?: boolean;
  itemNotes?: string | null;
  findings?: string | null;
  conclusion?: string | null;
}

export interface PrescriptionItemDto {
  id: string;
  medicationName: string;
  dosage?: string | null;
  scheduleTimes?: string[] | null;
  daysOfWeek?: string[] | null;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
}

export interface HealthPrescriptionDto {
  id: string;
  doctorName: string;
  prescriptionDate: string;
  notes?: string | null;
  items: PrescriptionItemDto[];
  user: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface HealthAiOverviewDto {
  id: string;
  reportContent: string;
  generatedAt: string;
  createdAt?: string;
  user: { id: string; name: string };
  generatedBy?: { id: string; name: string };
}

export interface HealthOverviewListParams {
  targetUserId?: string;
  startDate?: string;
  endDate?: string;
}

export interface HealthPatientContextDto {
  id: string;
  content: string;
  createdAt: string;
  createdBy: { id: string; name: string };
}

export interface GenerateOverviewPayload {
  targetUserId?: string;
  patientContext?: string;
}

export interface CreatePatientContextPayload {
  content: string;
  targetUserId?: string;
}

// ─── Request DTOs ──────────────────────────────────────────────────────────

export interface CreateHealthExamItemPayload {
  itemName: string;
  material?: string;
  method?: string;
  resultValue?: string;
  resultUnit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  itemNotes?: string;
  findings?: string;
  conclusion?: string;
}

export interface CreateHealthExamPayload {
  labName?: string;
  doctorName?: string;
  examDate?: string;
  examType: HealthExamType;
  notes?: string;
  targetUserId?: string;
  items?: CreateHealthExamItemPayload[];
}

export interface HealthExamFilterParams {
  examName?: string;
  doctorName?: string;
  labName?: string;
  dateFrom?: string;
  dateTo?: string;
  examType?: HealthExamType;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface CreatePrescriptionItemPayload {
  medicationName: string;
  dosage?: string;
  scheduleTimes?: string[];
  daysOfWeek?: string[] | null;
  startDate?: string;
  endDate?: string | null;
  notes?: string;
}

export interface CreatePrescriptionPayload {
  doctorName: string;
  prescriptionDate: string;
  notes?: string;
  targetUserId?: string;
  items?: CreatePrescriptionItemPayload[];
}

export interface ExtractedPrescriptionItem {
  medicationName: string;
  dosage?: string;
  scheduleTimes?: string[];
  daysOfWeek?: string[] | null;
  startDate?: string;
  endDate?: string | null;
  notes?: string;
}

export interface ExtractedPrescriptionData {
  doctorName?: string;
  prescriptionDate?: string;
  notes?: string;
  items: ExtractedPrescriptionItem[];
}
