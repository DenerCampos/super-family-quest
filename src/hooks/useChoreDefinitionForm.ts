import { useToast } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useForm,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services';
import { useAuth } from '../contexts/AuthContext';
import {
  CHORE_DEFINITION_RECURRENCE_VALUES,
  buildChoreDefinitionSchema,
  type ChoreDefinitionFormValues,
} from '../pages/NewChallenge/choreDefinitionForm/schema';
import { choreQueryKeys } from './choreQueryKeys';
import { useFamilyGroup } from './useFamilyGroup';
import { useThemedTranslation } from './useThemedTranslation';
import { useVisualTheme } from './useVisualTheme';
import { pickAdminFamilyGroupId } from '../utils/adminFamilyMembers';
import { isAdmin } from '../utils/familyGroupPermissions';
import { parseBRLCurrency, numberToBRLCurrencyInputValue } from '../utils/formatCurrency';

export const useChoreDefinitionForm = () => {
  const { definitionId } = useParams<{ definitionId: string }>();
  const isNew = definitionId === 'new' || !definitionId;
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { theme } = useVisualTheme();
  const { familyGroup, familyGroups, isLoadingGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const { profile } = useAuth();
  const { t } = useThemedTranslation();
  const userId = profile?.user.id ?? '';
  const stateFamilyGroupId = (
    location.state as { familyGroupId?: string } | undefined
  )?.familyGroupId;
  const groupId =
    stateFamilyGroupId ??
    pickAdminFamilyGroupId(familyGroups, userId, familyGroup?.id) ??
    familyGroup?.id;
  const resolvedFamilyGroup =
    familyGroups.find((g) => g.id === groupId) ?? familyGroup;
  const userIsAdmin = resolvedFamilyGroup
    ? isAdmin(resolvedFamilyGroup, userId)
    : false;

  const schema = useMemo(() => buildChoreDefinitionSchema(t), [t]);

  const existingQuery = useQuery({
    queryKey: [...choreQueryKeys.definitions(groupId ?? ''), definitionId],
    queryFn: async () => {
      const res = await api.choreListDefinitions(groupId!, {
        page: 1,
        limit: 100,
      });
      return res.data.find((d) => d.id === definitionId) ?? null;
    },
    enabled: !!groupId && !!definitionId && !isNew,
  });

  const formMethods = useForm<ChoreDefinitionFormValues>({
    resolver: yupResolver(schema) as Resolver<ChoreDefinitionFormValues>,
    defaultValues: {
      title: '',
      description: '',
      rewardValue: '',
      coinReward: 0,
      requirePhoto: false,
      recurrence: 'once',
      isActive: true,
    },
  });

  const { register, control, reset, handleSubmit, formState } = formMethods;

  useEffect(() => {
    if (!existingQuery.data) return;
    const d = existingQuery.data;
    reset({
      title: d.title,
      description: d.description ?? '',
      rewardValue: numberToBRLCurrencyInputValue(Number(d.rewardValue)),
      coinReward: d.coinReward,
      requirePhoto: d.requirePhoto,
      recurrence: d.recurrence,
      isActive: d.isActive,
    });
  }, [existingQuery.data, reset]);

  useEffect(() => {
    if (!isLoadingGroup && resolvedFamilyGroup && !userIsAdmin) {
      toast({ title: t('chores.adminOnlyDefinitions'), status: 'warning' });
      navigate('/new-resources/quests/definitions', { replace: true });
    }
  }, [
    isLoadingGroup,
    resolvedFamilyGroup,
    userIsAdmin,
    navigate,
    toast,
    t,
  ]);

  const createMutation = useMutation({
    mutationFn: (body: Parameters<typeof api.choreCreateDefinition>[1]) =>
      api.choreCreateDefinition(groupId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      toast({ title: t('common.created'), status: 'success' });
      navigate('/new-resources/quests/definitions');
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('common.createError'),
        status: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (body: Parameters<typeof api.choreUpdateDefinition>[2]) =>
      api.choreUpdateDefinition(groupId!, definitionId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: choreQueryKeys.root });
      toast({ title: t('common.updated'), status: 'success' });
      navigate('/new-resources/quests/definitions');
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('common.updateError'),
        status: 'error',
      });
    },
  });

  const submit: SubmitHandler<ChoreDefinitionFormValues> = (data) => {
    const rewardValue = parseBRLCurrency(data.rewardValue);
    if (isNew) {
      createMutation.mutate({
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        rewardValue,
        coinReward: data.coinReward || undefined,
        requirePhoto: data.requirePhoto || undefined,
        recurrence: data.recurrence,
      });
    } else {
      updateMutation.mutate({
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        rewardValue,
        coinReward: data.coinReward,
        requirePhoto: data.requirePhoto,
        recurrence: data.recurrence,
        isActive: data.isActive,
      });
    }
  };

  const switchColorScheme = theme.colors.primary;

  return {
    isNew,
    familyGroup: resolvedFamilyGroup,
    isLoadingGroup,
    existingQuery,
    userIsAdmin,
    recurrenceValues: CHORE_DEFINITION_RECURRENCE_VALUES,
    register,
    control,
    submitForm: handleSubmit(submit),
    formState,
    createMutation,
    updateMutation,
    switchColorScheme,
    t,
  };
};
