import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { HealthService } from '../services/health';
import { healthQueryKeys } from './healthQueryKeys';
import { useHealthViewerId } from './useHealthViewerId';
import { useThemedTranslation } from './useThemedTranslation';
import type {
  CreatePrescriptionPayload,
  HealthPrescriptionFilterParams,
} from '../types/health';

export const useHealthPrescriptions = (params?: HealthPrescriptionFilterParams) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.prescriptions(viewerId, params),
    queryFn: () => HealthService.listPrescriptions(params),
    staleTime: 30_000,
  });
};

export const useHealthPrescription = (id: string) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.prescription(viewerId, id),
    queryFn: () => HealthService.getPrescriptionById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
};

export const useCreatePrescription = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (payload: CreatePrescriptionPayload) =>
      HealthService.createPrescription(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.prescriptions(viewerId),
      });
      toast({
        title: t('health.toast.prescriptionCreated'),
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.prescriptionCreateError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useUpdatePrescription = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreatePrescriptionPayload>;
    }) => HealthService.updatePrescription(id, payload),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.prescriptions(viewerId),
      });
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.prescription(viewerId, vars.id),
      });
      toast({
        title: t('health.toast.prescriptionUpdated'),
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.prescriptionUpdateError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useDeletePrescription = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (id: string) => HealthService.deletePrescription(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.prescriptions(viewerId),
      });
      toast({
        title: t('health.toast.prescriptionDeleted'),
        status: 'info',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.prescriptionDeleteError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useAnalyzePrescription = () => {
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (file: File) => HealthService.analyzePrescription(file),
    onSuccess: () => {
      toast({
        title: t('health.toast.prescriptionAnalyzed'),
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.prescriptionAnalyzeError'),
        status: 'error',
        duration: 4000,
      });
    },
  });
};
