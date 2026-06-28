import { useMemo } from 'react';
import { useFieldArray, useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import {
  buildHealthExamSchema,
  defaultHealthExamFormValues,
  defaultHealthExamItem,
  type HealthExamFormValues,
} from '../pages/NewHealth/schemas/healthExamSchema';
import { useThemedTranslation } from './useThemedTranslation';
import { useCreateHealthExam } from './useHealthExams';
import type { CreateHealthExamPayload } from '../types/health';

function toCreatePayload(values: HealthExamFormValues): CreateHealthExamPayload {
  const isLaboratory = values.examType === 'LABORATORY';

  return {
    examType: values.examType,
    labName: values.labName.trim() || undefined,
    doctorName: values.doctorName.trim() || undefined,
    examDate: values.examDate || undefined,
    notes: values.notes.trim() || undefined,
    targetUserId: values.targetUserId || undefined,
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
  };
}

export function useHealthExamRegisterForm() {
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const createMutation = useCreateHealthExam();

  const schema = useMemo(() => buildHealthExamSchema(t), [t]);

  const formMethods = useForm<HealthExamFormValues>({
    resolver: yupResolver(schema) as Resolver<HealthExamFormValues>,
    defaultValues: defaultHealthExamFormValues,
  });

  const itemsFieldArray = useFieldArray({
    control: formMethods.control,
    name: 'items',
  });

  const examType = formMethods.watch('examType');

  const onSubmit = formMethods.handleSubmit(async (values) => {
    await createMutation.mutateAsync(toCreatePayload(values));
    navigate('/new-resources/health/search');
  });

  const addItem = () => {
    itemsFieldArray.append({ ...defaultHealthExamItem });
  };

  const removeItem = (index: number) => {
    if (itemsFieldArray.fields.length <= 1) return;
    itemsFieldArray.remove(index);
  };

  return {
    formMethods,
    itemsFieldArray,
    examType,
    onSubmit,
    addItem,
    removeItem,
    isSubmitting: createMutation.isPending,
  };
}
