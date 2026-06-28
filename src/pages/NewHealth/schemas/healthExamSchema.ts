import * as yup from 'yup';
import type { HealthExamType } from '../../../types/health';
import { HEALTH_EXAM_TYPE_VALUES } from '../../../utils/healthConstants';

export interface HealthExamItemFormValues {
  itemName: string;
  resultValue: string;
  resultUnit: string;
  referenceRange: string;
  itemNotes: string;
  findings: string;
  conclusion: string;
  isAbnormal: boolean;
}

export interface HealthExamFormValues {
  examType: HealthExamType;
  labName: string;
  doctorName: string;
  examDate: string;
  notes: string;
  targetUserId: string;
  items: HealthExamItemFormValues[];
}

export const defaultHealthExamItem: HealthExamItemFormValues = {
  itemName: '',
  resultValue: '',
  resultUnit: '',
  referenceRange: '',
  itemNotes: '',
  findings: '',
  conclusion: '',
  isAbnormal: false,
};

export const defaultHealthExamFormValues: HealthExamFormValues = {
  examType: 'LABORATORY',
  labName: '',
  doctorName: '',
  examDate: '',
  notes: '',
  targetUserId: '',
  items: [{ ...defaultHealthExamItem }],
};

export function buildHealthExamSchema(t: (key: string) => string) {
  const itemSchema = yup.object({
    itemName: yup.string().required(t('health.validation.itemNameRequired')),
    resultValue: yup.string().default(''),
    resultUnit: yup.string().default(''),
    referenceRange: yup.string().default(''),
    itemNotes: yup.string().default(''),
    findings: yup.string().default(''),
    conclusion: yup.string().default(''),
    isAbnormal: yup.boolean().default(false),
  });

  return yup.object({
    examType: yup
      .string()
      .oneOf([...HEALTH_EXAM_TYPE_VALUES])
      .required(),
    labName: yup.string().default(''),
    doctorName: yup.string().default(''),
    examDate: yup.string().default(''),
    notes: yup.string().default(''),
    targetUserId: yup.string().default(''),
    items: yup
      .array()
      .of(itemSchema)
      .min(1, t('health.validation.itemsMin'))
      .test('has-named-item', t('health.validation.itemsMin'), (items) =>
        (items ?? []).some((item) => item?.itemName?.trim()),
      )
      .required(),
  });
}

export interface HealthPendingReviewFormValues {
  examType: HealthExamType;
  labName: string;
  doctorName: string;
  examDate: string;
  notes: string;
  items: HealthExamItemFormValues[];
}

export function buildHealthPendingReviewSchema(t: (key: string) => string) {
  return buildHealthExamSchema(t).pick([
    'examType',
    'labName',
    'doctorName',
    'examDate',
    'notes',
    'items',
  ]);
}
