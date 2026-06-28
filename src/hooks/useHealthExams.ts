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
import { validateHealthUploadFiles } from '../utils/healthUpload';
import type {
  CreateHealthExamPayload,
  HealthExamFilterParams,
} from '../types/health';

export const useHealthExams = (filter: HealthExamFilterParams = {}) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.exams(viewerId, filter),
    queryFn: () => HealthService.listExams(filter),
    staleTime: 30_000,
  });
};

export const useHealthExam = (id: string) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.exam(viewerId, id),
    queryFn: () => HealthService.getExamById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
};

export const useCreateHealthExam = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (payload: CreateHealthExamPayload) =>
      HealthService.createExam(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.all(viewerId) });
      toast({
        title: t('health.toast.examCreated'),
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.examCreateError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useUpdateHealthExam = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateHealthExamPayload> }) =>
      HealthService.updateExam(id, payload),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.exams(viewerId) });
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.exam(viewerId, vars.id) });
      toast({
        title: t('health.toast.examUpdated'),
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.examUpdateError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useDeleteHealthExam = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (id: string) => HealthService.deleteExam(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.all(viewerId) });
      toast({
        title: t('health.toast.examDeleted'),
        status: 'info',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.examDeleteError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useUploadHealthFiles = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: ({ files, targetUserId }: { files: File[]; targetUserId?: string }) => {
      const validation = validateHealthUploadFiles(files);
      if (!validation.ok) {
        if (validation.reason === 'type') {
          throw new Error('INVALID_TYPE');
        }
        if (validation.reason === 'size') {
          throw new Error('FILE_TOO_LARGE');
        }
        throw new Error('EMPTY');
      }
      return HealthService.uploadFiles(validation.files, targetUserId);
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.processing(viewerId) });
      toast({
        title: t('health.toast.filesUploaded', { count: data.length }),
        status: 'success',
        duration: 4000,
      });
    },
    onError: (error: Error) => {
      if (error.message === 'FILE_TOO_LARGE') {
        toast({
          title: t('health.toast.fileTooLarge'),
          status: 'error',
          duration: 4000,
        });
        return;
      }
      if (error.message === 'INVALID_TYPE') {
        toast({
          title: t('health.toast.invalidFileType'),
          status: 'error',
          duration: 4000,
        });
        return;
      }
      toast({
        title: t('health.toast.uploadError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useHealthProcessing = () => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.processing(viewerId),
    queryFn: () => HealthService.listProcessing(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
};

export const useHealthProcessingItem = (id: string) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.processingItem(viewerId, id),
    queryFn: () => HealthService.getProcessingById(id),
    enabled: !!id,
  });
};

export const useApproveProcessing = () => {
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
      payload: Partial<CreateHealthExamPayload>;
    }) => HealthService.approveProcessing(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.processing(viewerId) });
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.exams(viewerId) });
      toast({
        title: t('health.toast.examSaved'),
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.examSaveError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useRetryProcessing = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (id: string) => HealthService.retryProcessing(id),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.processing(viewerId) });
      if (result.status === 'COMPLETED') {
        toast({
          title: t('health.toast.retrySuccess'),
          status: 'success',
          duration: 3000,
        });
      } else if (result.status === 'FAILED') {
        toast({
          title: t('health.toast.retryFailed'),
          status: 'error',
          duration: 4000,
        });
      }
    },
    onError: () => {
      toast({
        title: t('health.toast.retryError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};

export const useDiscardProcessing = () => {
  const viewerId = useHealthViewerId();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (id: string) => HealthService.discardProcessing(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: healthQueryKeys.processing(viewerId) });
      toast({
        title: t('health.toast.fileDiscarded'),
        status: 'info',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: t('health.toast.discardError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
};
