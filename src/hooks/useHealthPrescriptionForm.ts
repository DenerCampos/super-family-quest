import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMatch, useNavigate } from 'react-router-dom';
import {
  buildHealthPrescriptionSchema,
  defaultPrescriptionFormValues,
  defaultPrescriptionItem,
  mapExtractedPrescriptionToFormValues,
  toPrescriptionItemPayload,
  type HealthPrescriptionFormValues,
} from '../pages/NewHealth/schemas/healthPrescriptionSchema';
import { useThemedTranslation } from './useThemedTranslation';
import {
  useAnalyzePrescription,
  useCreatePrescription,
  useHealthPrescription,
  useUpdatePrescription,
} from './useHealthPrescriptions';
import type { ExtractedPrescriptionData } from '../types/health';

export function useHealthPrescriptionForm() {
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const editMatch = useMatch('/new-resources/health/prescriptions/:id/edit');
  const prescriptionId = editMatch?.params?.id ?? '';
  const isEditing = Boolean(prescriptionId);

  const { data: existing, isLoading: isLoadingExisting } = useHealthPrescription(
    prescriptionId,
  );
  const createMutation = useCreatePrescription();
  const updateMutation = useUpdatePrescription();
  const analyzeMutation = useAnalyzePrescription();

  const schema = useMemo(() => buildHealthPrescriptionSchema(t), [t]);

  const formMethods = useForm<HealthPrescriptionFormValues>({
    resolver: yupResolver(schema) as Resolver<HealthPrescriptionFormValues>,
    defaultValues: defaultPrescriptionFormValues,
  });

  const itemsFieldArray = useFieldArray({
    control: formMethods.control,
    name: 'items',
  });

  useEffect(() => {
    if (!existing || !isEditing) return;
    formMethods.reset({
      doctorName: existing.doctorName,
      prescriptionDate: existing.prescriptionDate,
      notes: existing.notes ?? '',
      targetUserId: '',
      items:
        existing.items.length > 0
          ? existing.items.map((item) => ({
              medicationName: item.medicationName,
              dosage: item.dosage ?? '',
              scheduleTimes: item.scheduleTimes ?? ['08:00'],
              daysOfWeek: item.daysOfWeek ?? null,
              startDate: item.startDate ?? '',
              endDate: item.endDate ?? null,
              notes: item.notes ?? '',
            }))
          : [{ ...defaultPrescriptionItem }],
    });
  }, [existing, isEditing, formMethods]);

  const onSubmit = formMethods.handleSubmit(async (values) => {
    const payload = {
      doctorName: values.doctorName.trim(),
      prescriptionDate: values.prescriptionDate,
      notes: values.notes.trim() || undefined,
      targetUserId: values.targetUserId || undefined,
      items: values.items.map(toPrescriptionItemPayload),
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id: prescriptionId, payload });
      navigate(`/new-resources/health/prescriptions/${prescriptionId}`);
      return;
    }

    const created = await createMutation.mutateAsync(payload);
    navigate(`/new-resources/health/prescriptions/${created.id}`);
  });

  const addMedication = () => {
    itemsFieldArray.append({ ...defaultPrescriptionItem });
  };

  const removeMedication = (index: number) => {
    if (itemsFieldArray.fields.length <= 1) return;
    itemsFieldArray.remove(index);
  };

  const addScheduleTime = (itemIndex: number) => {
    const current = formMethods.getValues(`items.${itemIndex}.scheduleTimes`) ?? [];
    formMethods.setValue(`items.${itemIndex}.scheduleTimes`, [...current, '08:00'], {
      shouldDirty: true,
    });
  };

  const removeScheduleTime = (itemIndex: number, timeIndex: number) => {
    const current = formMethods.getValues(`items.${itemIndex}.scheduleTimes`) ?? [];
    if (current.length <= 1) return;
    formMethods.setValue(
      `items.${itemIndex}.scheduleTimes`,
      current.filter((_, i) => i !== timeIndex),
      { shouldDirty: true },
    );
  };

  const toggleDay = (itemIndex: number, day: string) => {
    const current = formMethods.getValues(`items.${itemIndex}.daysOfWeek`);
    if (current == null) {
      formMethods.setValue(`items.${itemIndex}.daysOfWeek`, [day], { shouldDirty: true });
      return;
    }
    const has = current.includes(day);
    const next = has ? current.filter((d) => d !== day) : [...current, day];
    formMethods.setValue(
      `items.${itemIndex}.daysOfWeek`,
      next.length === 0 ? null : next,
      { shouldDirty: true },
    );
  };

  const setEveryDay = (itemIndex: number) => {
    formMethods.setValue(`items.${itemIndex}.daysOfWeek`, null, { shouldDirty: true });
  };

  const applyExtractedPrescription = (data: ExtractedPrescriptionData) => {
    const current = formMethods.getValues();
    formMethods.reset(mapExtractedPrescriptionToFormValues(data, current));
  };

  const analyzeFromFile = async (file: File) => {
    const data = await analyzeMutation.mutateAsync(file);
    applyExtractedPrescription(data);
  };

  return {
    formMethods,
    itemsFieldArray,
    isEditing,
    prescriptionId,
    isLoadingExisting,
    onSubmit,
    addMedication,
    removeMedication,
    addScheduleTime,
    removeScheduleTime,
    toggleDay,
    setEveryDay,
    applyExtractedPrescription,
    analyzeFromFile,
    isAnalyzing: analyzeMutation.isPending,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
