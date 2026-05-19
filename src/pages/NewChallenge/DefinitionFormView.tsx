import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { formatCurrencyInputBRL } from '../../utils/formatCurrency';
import { useChoreDefinitionForm } from '../../hooks/useChoreDefinitionForm';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { ChallengePageScaffold } from './ChallengePageScaffold';
import { NoFamilyGroupHint } from './NoFamilyGroupHint';

export const DefinitionFormView = () => {
  const { getColor } = useVisualTheme();
  const {
    isNew,
    familyGroup,
    isLoadingGroup,
    existingQuery,
    userIsAdmin,
    recurrenceValues,
    register,
    control,
    submitForm,
    formState: { errors, isSubmitting },
    createMutation,
    updateMutation,
    switchColorScheme,
    t,
  } = useChoreDefinitionForm();

  if (isLoadingGroup) {
    return (
      <ChallengePageScaffold title={t('chores.definitionFormTitle')} isLoading />
    );
  }

  if (!familyGroup) {
    return (
      <ChallengePageScaffold title={t('chores.definitionFormTitle')}>
        <NoFamilyGroupHint />
      </ChallengePageScaffold>
    );
  }

  if (!userIsAdmin) {
    return (
      <ChallengePageScaffold title={t('chores.definitionFormTitle')} isLoading />
    );
  }

  if (!isNew && existingQuery.isLoading) {
    return (
      <ChallengePageScaffold title={t('chores.definitionFormTitle')} isLoading />
    );
  }

  if (!isNew && existingQuery.isFetched && !existingQuery.data) {
    return (
      <ChallengePageScaffold title={t('chores.definitionFormTitle')}>
        <Text color={getColor('text.dashboard.tileSubtitle')}>
          {t('chores.notFound')}
        </Text>
      </ChallengePageScaffold>
    );
  }

  return (
    <ChallengePageScaffold
      title={
        isNew ? t('chores.newDefinition') : t('chores.editDefinition')
      }
    >
      <VStack
        as="form"
        align="stretch"
        spacing={4}
        onSubmit={submitForm}
        pb={8}
      >
        <FormControl isInvalid={!!errors.title}>
          <FormLabel color={getColor('text.familyGroup.title')}>{t('chores.fieldTitle')}</FormLabel>
          <Input
            {...register('title')}
            borderColor={getColor('border.primary')}
            color={getColor('text.familyGroup.title')}
          />
        </FormControl>
        <FormControl>
          <FormLabel color={getColor('text.familyGroup.title')}>
            {t('chores.fieldDescription')}
          </FormLabel>
          <Textarea
            {...register('description')}
            borderColor={getColor('border.primary')}
            color={getColor('text.familyGroup.title')}
          />
        </FormControl>
        <FormControl isInvalid={!!errors.rewardValue}>
          <FormLabel color={getColor('text.familyGroup.title')}>
            {t('chores.fieldRewardValue')}
          </FormLabel>
          <Controller
            name="rewardValue"
            control={control}
            render={({ field }) => (
              <Input
                borderColor={getColor('border.primary')}
                color={getColor('text.familyGroup.title')}
                inputMode="numeric"
                autoComplete="off"
                placeholder="0,00"
                value={field.value}
                onChange={(e) =>
                  field.onChange(formatCurrencyInputBRL(e.target.value))
                }
                onBlur={field.onBlur}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel color={getColor('text.familyGroup.title')}>
            {t('chores.fieldCoinReward')}
          </FormLabel>
          <Input
            type="number"
            min={0}
            step={1}
            {...register('coinReward', { valueAsNumber: true })}
            borderColor={getColor('border.primary')}
            color={getColor('text.familyGroup.title')}
          />
        </FormControl>
        <FormControl>
          <FormLabel color={getColor('text.familyGroup.title')}>
            {t('chores.fieldRecurrence')}
          </FormLabel>
          <Controller
            name="recurrence"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${getColor('border.primary')}`,
                  background: getColor('background.primary'),
                  color: getColor('text.familyGroup.title'),
                }}
              >
                {recurrenceValues.map((r) => (
                  <option key={r} value={r}>
                    {t(`chores.recurrence.${r}`)}
                  </option>
                ))}
              </select>
            )}
          />
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb={0} color={getColor('text.familyGroup.title')}>
            {t('chores.fieldRequirePhoto')}
          </FormLabel>
          <Controller
            name="requirePhoto"
            control={control}
            render={({ field }) => (
              <Switch
                isChecked={field.value}
                onChange={field.onChange}
                colorScheme={switchColorScheme}
              />
            )}
          />
        </FormControl>
        {!isNew && (
          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0} color={getColor('text.familyGroup.title')}>
              {t('chores.fieldActive')}
            </FormLabel>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  isChecked={field.value}
                  onChange={field.onChange}
                  colorScheme={switchColorScheme}
                />
              )}
            />
          </FormControl>
        )}
        <Button
          type="submit"
          bg={getColor('button.background.primary')}
          color={getColor('button.text.primary')}
          isLoading={
            isSubmitting ||
            createMutation.isPending ||
            updateMutation.isPending
          }
        >
          {t('common.save')}
        </Button>
      </VStack>
    </ChallengePageScaffold>
  );
};
