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
import { useHealthExam, useUpdateHealthExam } from './useHealthExams';
import type { CreateHealthExamItemPayload, HealthExamDto } from '../types/health';

function mapExamItem(item: HealthExamDto['items'][number]): CreateHealthExamItemPayload {
  return {
    itemName: item.itemName,
    material: item.material ?? undefined,
    method: item.method ?? undefined,
    resultValue: item.resultValue ?? undefined,
    resultUnit: item.resultUnit ?? undefined,
    referenceRange: item.referenceRange ?? undefined,
    isAbnormal: item.isAbnormal,
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

export function useHealthExamEditForm() {
  const { id = '' } = useParams<{ id: string }>();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { data: exam, isLoading } = useHealthExam(id);
  const updateMutation = useUpdateHealthExam();

  const schema = useMemo(() => buildHealthPendingReviewSchema(t), [t]);

  const formMethods = useForm<HealthPendingReviewFormValues>({
    resolver: yupResolver(schema) as Resolver<HealthPendingReviewFormValues>,
    defaultValues: {
      examType: 'LABORATORY',
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
    if (!exam) return;
    formMethods.reset({
      examType: exam.examType,
      labName: exam.labName ?? '',
      doctorName: exam.doctorName ?? '',
      examDate: exam.examDate ?? '',
      notes: exam.notes ?? '',
      items:
        exam.items.length > 0
          ? exam.items.map(mapExamItem).map(toFormItem)
          : [{ ...defaultHealthExamItem }],
    });
  }, [exam, formMethods]);

  const onSubmit = formMethods.handleSubmit(async (values) => {
    const isLaboratory = values.examType === 'LABORATORY';
    await updateMutation.mutateAsync({
      id,
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
    navigate(`/new-resources/health/exams/${id}`);
  });

  const addItem = () => {
    itemsFieldArray.append({ ...defaultHealthExamItem });
  };

  const removeItem = (index: number) => {
    if (itemsFieldArray.fields.length <= 1) return;
    itemsFieldArray.remove(index);
  };

  return {
    exam,
    isLoading,
    formMethods,
    itemsFieldArray,
    onSubmit,
    addItem,
    removeItem,
    isSubmitting: updateMutation.isPending,
  };
}
