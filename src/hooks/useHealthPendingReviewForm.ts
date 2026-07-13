import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import {
  buildHealthPendingReviewSchema,
  defaultHealthExamItem,
  type HealthPendingReviewFormValues,
} from '../pages/NewHealth/schemas/healthExamSchema';
import { useThemedTranslation } from './useThemedTranslation';
import {
  useApproveProcessing,
  useHealthProcessingItem,
} from './useHealthExams';
import type { CreateHealthExamItemPayload, ExtractedExamData, ExtractedExamItem } from '../types/health';

function inferExamType(data: ExtractedExamData): ExtractedExamData['examType'] {
  if (data.examType && data.examType !== 'OTHER') return data.examType;
  const items = data.items ?? [];
  const hasImagingFields = items.some((i) => i.findings?.trim());
  const hasLabFields = items.some(
    (i) =>
      i.resultValue?.trim() &&
      (i.referenceRange?.trim() || i.resultUnit?.trim()),
  );
  if (hasImagingFields && !hasLabFields) return 'IMAGING';
  if (hasLabFields) return 'LABORATORY';
  if (hasImagingFields) return 'IMAGING';
  return data.examType ?? 'OTHER';
}

function mapExtractedItem(item: ExtractedExamItem): CreateHealthExamItemPayload {
  return {
    itemName: item.itemName ?? '',
    material: item.material ?? undefined,
    method: item.method ?? undefined,
    resultValue: item.resultValue ?? undefined,
    resultUnit: item.resultUnit ?? undefined,
    referenceRange: item.referenceRange ?? undefined,
    isAbnormal: item.isAbnormal ?? false,
    itemNotes: item.itemNotes ?? undefined,
    findings: item.findings ?? undefined,
    conclusion: item.conclusion ?? undefined,
  };
}

function toFormItem(item: CreateHealthExamItemPayload) {
  return {
    itemName: item.itemName,
    resultValue: item.resultValue ?? '',
    resultUnit: item.resultUnit ?? '',
    referenceRange: item.referenceRange ?? '',
    itemNotes: item.itemNotes ?? '',
    findings: item.findings ?? '',
    conclusion: item.conclusion ?? '',
    isAbnormal: item.isAbnormal ?? false,
  };
}

export function useHealthPendingReviewForm() {
  const { id } = useParams<{ id: string }>();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { data: processing, isLoading } = useHealthProcessingItem(id ?? '');
  const approveMutation = useApproveProcessing();

  const schema = useMemo(() => buildHealthPendingReviewSchema(t), [t]);

  const formMethods = useForm<HealthPendingReviewFormValues>({
    resolver: yupResolver(schema) as Resolver<HealthPendingReviewFormValues>,
    defaultValues: {
      examType: 'OTHER',
      labName: '',
      doctorName: '',
      examDate: '',
      notes: '',
      items: [{ ...defaultHealthExamItem }],
    },
  });

  const itemsFieldArray = useFieldArray({
    control: formMethods.control,
    name: 'items',
  });

  useEffect(() => {
    if (!processing?.extractedData) return;
    const d = processing.extractedData;
    formMethods.reset({
      examType: inferExamType(d),
      labName: d.labName ?? '',
      doctorName: d.doctorName ?? '',
      examDate: d.examDate ?? '',
      notes: d.notes ?? '',
      items:
        (d.items ?? []).length > 0
          ? (d.items ?? []).map(mapExtractedItem).map(toFormItem)
          : [{ ...defaultHealthExamItem }],
    });
  }, [processing, formMethods]);

  const onSubmit = formMethods.handleSubmit(async (values) => {
    const isLaboratory = values.examType === 'LABORATORY';
    await approveMutation.mutateAsync({
      id: id!,
      payload: {
        examType: values.examType,
        labName: values.labName.trim() || undefined,
        doctorName: values.doctorName.trim() || undefined,
        examDate: values.examDate || undefined,
        notes: values.notes.trim() || undefined,
        items: values.items
          .filter((item) => item.itemName.trim())
          .map((item) => ({
            itemName: item.itemName.trim(),
            resultValue: isLaboratory ? item.resultValue.trim() || undefined : undefined,
            resultUnit: isLaboratory ? item.resultUnit.trim() || undefined : undefined,
            referenceRange: isLaboratory ? item.referenceRange.trim() || undefined : undefined,
            itemNotes: isLaboratory ? item.itemNotes.trim() || undefined : undefined,
            isAbnormal: item.isAbnormal,
            findings: !isLaboratory ? item.findings.trim() || undefined : undefined,
            conclusion: !isLaboratory ? item.conclusion.trim() || undefined : undefined,
          })),
      },
    });
    navigate('/new-resources/health/exams?tab=processing');
  });

  const removeItem = (index: number) => {
    itemsFieldArray.remove(index);
  };

  return {
    processing,
    isLoading,
    formMethods,
    itemsFieldArray,
    onSubmit,
    removeItem,
    isSubmitting: approveMutation.isPending,
  };
}
