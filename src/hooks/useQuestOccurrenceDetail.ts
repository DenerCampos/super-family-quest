import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useFamilyGroup } from './useFamilyGroup';
import { choreQueryKeys } from './choreQueryKeys';
import { useThemedTranslation } from './useThemedTranslation';
import type { ChoreOccurrenceResponseDto } from '../types/chore';
import {
  CHORE_PHOTO_ACCEPT_LIST,
  CHORE_PHOTO_MAX_BYTES,
} from '../utils/chore-occurrence-photo-constants';
import { compressImage } from '../utils/compressImage';

const isChorePhotoType = (mime: string): boolean =>
  (CHORE_PHOTO_ACCEPT_LIST as readonly string[]).includes(mime);

export const useQuestOccurrenceDetail = () => {
  const { occurrenceId } = useParams<{ occurrenceId: string }>();
  const location = useLocation();
  const locationState = location.state as
    | {
        occurrence?: ChoreOccurrenceResponseDto;
        familyGroupId?: string;
      }
    | undefined;
  const initialOccurrence = locationState?.occurrence;
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { familyGroup, familyGroups, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { profile } = useAuth();
  const { t } = useThemedTranslation();
  const groupId =
    locationState?.familyGroupId ??
    (initialOccurrence as { familyGroupId?: string } | undefined)
      ?.familyGroupId ??
    familyGroup?.id;
  const resolvedFamilyGroup =
    familyGroups.find((g) => g.id === groupId) ?? familyGroup;
  const userId = profile?.user.id;

  const beforeCameraRef = useRef<HTMLInputElement>(null);
  const beforeGalleryRef = useRef<HTMLInputElement>(null);
  const afterCameraRef = useRef<HTMLInputElement>(null);
  const afterGalleryRef = useRef<HTMLInputElement>(null);
  const [fileBefore, setFileBefore] = useState<File | null>(null);
  const [fileAfter, setFileAfter] = useState<File | null>(null);

  const detailQuery = useQuery({
    queryKey: choreQueryKeys.occurrenceDetail(
      groupId ?? '',
      occurrenceId ?? '',
    ),
    queryFn: () =>
      api.choreResolveOccurrence(groupId!, occurrenceId!),
    enabled: !!groupId && !!occurrenceId,
    initialData: initialOccurrence,
  });

  const occ = detailQuery.data ?? null;

  const uploadMutation = useMutation({
    mutationFn: (files: { before?: File; after?: File }) =>
      api.choreUploadOccurrencePhotos(groupId!, occurrenceId!, files),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        choreQueryKeys.occurrenceDetail(groupId!, occurrenceId!),
        data,
      );
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      if (variables.before) {
        setFileBefore(null);
        if (beforeCameraRef.current) beforeCameraRef.current.value = '';
        if (beforeGalleryRef.current) beforeGalleryRef.current.value = '';
      }
      if (variables.after) {
        setFileAfter(null);
        if (afterCameraRef.current) afterCameraRef.current.value = '';
        if (afterGalleryRef.current) afterGalleryRef.current.value = '';
      }
      toast({ title: t('chores.photosUploaded'), status: 'success' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chores.photoUploadError'),
        status: 'error',
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      api.choreSubmitOccurrence(groupId!, occurrenceId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      toast({ title: t('chores.submittedForApproval'), status: 'success' });
      navigate('/new-resources/quests/chores');
    },
    onError: (err: unknown) => {
      const msg = axios.isAxiosError(err)
        ? parseApiMessage(err.response?.data)
        : undefined;
      toast({
        title: t('common.error'),
        description: msg ?? t('chores.submitError'),
        status: 'error',
      });
    },
  });

  const onPickBefore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFileBefore(null);
      return;
    }
    if (!isChorePhotoType(f.type)) {
      toast({ title: t('chores.photoInvalidType'), status: 'error' });
      e.target.value = '';
      return;
    }
    if (e.target === beforeCameraRef.current && beforeGalleryRef.current) {
      beforeGalleryRef.current.value = '';
    }
    if (e.target === beforeGalleryRef.current && beforeCameraRef.current) {
      beforeCameraRef.current.value = '';
    }
    try {
      const compressed = await compressImage(f);
      if (compressed.size > CHORE_PHOTO_MAX_BYTES) {
        toast({ title: t('chores.photoTooLarge'), status: 'error' });
        e.target.value = '';
        return;
      }
      setFileBefore(compressed);
    } catch {
      toast({
        title: t('common.error'),
        description: t('chores.photoProcessError'),
        status: 'error',
      });
      e.target.value = '';
    }
  };

  const onPickAfter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFileAfter(null);
      return;
    }
    if (!isChorePhotoType(f.type)) {
      toast({ title: t('chores.photoInvalidType'), status: 'error' });
      e.target.value = '';
      return;
    }
    if (e.target === afterCameraRef.current && afterGalleryRef.current) {
      afterGalleryRef.current.value = '';
    }
    if (e.target === afterGalleryRef.current && afterCameraRef.current) {
      afterCameraRef.current.value = '';
    }
    try {
      const compressed = await compressImage(f);
      if (compressed.size > CHORE_PHOTO_MAX_BYTES) {
        toast({ title: t('chores.photoTooLarge'), status: 'error' });
        e.target.value = '';
        return;
      }
      setFileAfter(compressed);
    } catch {
      toast({
        title: t('common.error'),
        description: t('chores.photoProcessError'),
        status: 'error',
      });
      e.target.value = '';
    }
  };

  const canActInProgress =
    occ?.status === 'IN_PROGRESS' && occ.assignedTo?.id === userId;

  const photosReadyForSubmit = occ
    ? !occ.definition.requirePhoto ||
      (!!occ.photoBeforeUrl && !!occ.photoAfterUrl)
    : false;

  const handleUploadBefore = () => {
    if (!occ || !groupId || !occurrenceId) return;
    if (!fileBefore) {
      toast({ title: t('chores.selectAtLeastOnePhoto'), status: 'warning' });
      return;
    }
    uploadMutation.mutate({ before: fileBefore });
  };

  const handleUploadAfter = () => {
    if (!occ || !groupId || !occurrenceId) return;
    if (!occ.photoBeforeUrl) {
      toast({ title: t('chores.needBeforePhoto'), status: 'warning' });
      return;
    }
    if (!fileAfter) {
      toast({ title: t('chores.selectAtLeastOnePhoto'), status: 'warning' });
      return;
    }
    uploadMutation.mutate({ after: fileAfter });
  };

  return {
    occurrenceId,
    initialOccurrence,
    navigate,
    detailQuery,
    occ,
    familyGroup: resolvedFamilyGroup,
    isLoadingGroup,
    beforeCameraRef,
    beforeGalleryRef,
    afterCameraRef,
    afterGalleryRef,
    fileBefore,
    fileAfter,
    uploadMutation,
    submitMutation,
    canActInProgress,
    photosReadyForSubmit,
    onPickBefore,
    onPickAfter,
    handleUploadBefore,
    handleUploadAfter,
    t,
  };
};

function parseApiMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const m = (body as Record<string, unknown>).message;
  return typeof m === 'string' ? m : undefined;
}
