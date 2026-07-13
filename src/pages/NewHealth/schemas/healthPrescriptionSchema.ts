import * as yup from 'yup';
import type {
  CreatePrescriptionItemPayload,
  ExtractedPrescriptionData,
} from '../../../types/health';
import { HEALTH_DAY_KEYS } from '../../../utils/healthConstants';

export interface HealthPrescriptionItemFormValues {
  medicationName: string;
  dosage: string;
  scheduleTimes: string[];
  daysOfWeek: string[] | null;
  startDate: string;
  endDate: string | null;
  notes: string;
}

export interface HealthPrescriptionFormValues {
  doctorName: string;
  prescriptionDate: string;
  notes: string;
  targetUserId: string;
  items: HealthPrescriptionItemFormValues[];
}

export const defaultPrescriptionItem: HealthPrescriptionItemFormValues = {
  medicationName: '',
  dosage: '',
  scheduleTimes: ['08:00'],
  daysOfWeek: null,
  startDate: '',
  endDate: null,
  notes: '',
};

export const defaultPrescriptionFormValues: HealthPrescriptionFormValues = {
  doctorName: '',
  prescriptionDate: '',
  notes: '',
  targetUserId: '',
  items: [{ ...defaultPrescriptionItem }],
};

export function toPrescriptionItemPayload(
  item: HealthPrescriptionItemFormValues,
): CreatePrescriptionItemPayload {
  return {
    medicationName: item.medicationName.trim(),
    dosage: item.dosage.trim() || undefined,
    scheduleTimes: item.scheduleTimes.filter(Boolean),
    daysOfWeek: item.daysOfWeek,
    startDate: item.startDate || undefined,
    endDate: item.endDate || null,
    notes: item.notes.trim() || undefined,
  };
}

export function mapExtractedPrescriptionToFormValues(
  data: ExtractedPrescriptionData,
  base: HealthPrescriptionFormValues = defaultPrescriptionFormValues,
): HealthPrescriptionFormValues {
  return {
    ...base,
    doctorName: data.doctorName?.trim() ?? base.doctorName,
    prescriptionDate: data.prescriptionDate ?? base.prescriptionDate,
    notes: data.notes?.trim() ?? base.notes,
    items:
      data.items?.length > 0
        ? data.items.map((item) => ({
            medicationName: item.medicationName?.trim() ?? '',
            dosage: item.dosage?.trim() ?? '',
            scheduleTimes:
              item.scheduleTimes?.filter(Boolean).length
                ? item.scheduleTimes.filter(Boolean)
                : ['08:00'],
            daysOfWeek: item.daysOfWeek ?? null,
            startDate: item.startDate ?? '',
            endDate: item.endDate ?? null,
            notes: item.notes?.trim() ?? '',
          }))
        : base.items,
  };
}

export function buildHealthPrescriptionSchema(t: (key: string) => string) {
  const itemSchema = yup.object({
    medicationName: yup
      .string()
      .trim()
      .required(t('health.validation.medicationNameRequired')),
    dosage: yup.string().default(''),
    scheduleTimes: yup
      .array()
      .of(yup.string().required())
      .min(1, t('health.validation.scheduleTimesMin'))
      .required(),
    daysOfWeek: yup
      .array()
      .of(yup.string().oneOf([...HEALTH_DAY_KEYS]))
      .nullable()
      .default(null),
    startDate: yup.string().default(''),
    endDate: yup.string().nullable().default(null),
    notes: yup.string().default(''),
  });

  return yup.object({
    doctorName: yup
      .string()
      .trim()
      .required(t('health.validation.doctorNameRequired')),
    prescriptionDate: yup
      .string()
      .required(t('health.validation.prescriptionDateRequired')),
    notes: yup.string().default(''),
    targetUserId: yup.string().default(''),
    items: yup
      .array()
      .of(itemSchema)
      .min(1, t('health.validation.medicationsMin'))
      .required(),
  });
}
