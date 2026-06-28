import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { HealthService } from '../services/health';
import { healthQueryKeys } from './healthQueryKeys';
import { useHealthViewerId } from './useHealthViewerId';
import { useThemedTranslation } from './useThemedTranslation';
import type { GenerateOverviewPayload } from '../types/health';

export const useHealthOverview = (targetUserId?: string) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.overview(viewerId, targetUserId),
    queryFn: () => HealthService.getLatestOverview(targetUserId),
    staleTime: 60_000,
  });
};

export const useHealthPatientContext = (targetUserId?: string) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.patientContext(viewerId, targetUserId),
    queryFn: () => HealthService.listPatientContext(targetUserId),
    staleTime: 30_000,
  });
};

export const useGenerateHealthOverview = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (payload: GenerateOverviewPayload = {}) =>
      HealthService.generateOverview(payload),
    onSuccess: (data, payload) => {
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.overviewAll(viewerId),
      });
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.overview(viewerId, payload.targetUserId),
      });
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.overview(viewerId, data.user.id),
      });
      void queryClient.invalidateQueries({
        queryKey: healthQueryKeys.patientContextAll(viewerId),
      });
      toast({
        title: t('health.toast.overviewGenerated'),
        status: 'success',
        duration: 4000,
      });
    },
    onError: (error) => {
      const message =
        isAxiosError(error) &&
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : null;

      const isNoNewData =
        message?.includes('Não há dados novos') ||
        message?.includes('Cadastre exames ou informe');

      toast({
        title: isNoNewData
          ? t('health.toast.overviewNoNewData')
          : t('health.toast.overviewError'),
        description: isNoNewData ? undefined : message ?? undefined,
        status: isNoNewData ? 'warning' : 'error',
        duration: 5000,
      });
    },
  });
};
