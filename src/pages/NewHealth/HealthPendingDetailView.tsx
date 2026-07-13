import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useDiscardProcessing } from '../../hooks/useHealthExams';
import { useHealthPendingReviewForm } from '../../hooks/useHealthPendingReviewForm';
import { getHealthExamTypeOptions } from '../../utils/healthConstants';
import type { HealthExamType } from '../../types/health';

export const HealthPendingDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const discardMutation = useDiscardProcessing();
  const examTypeOptions = getHealthExamTypeOptions(t);

  const {
    processing,
    isLoading,
    formMethods,
    itemsFieldArray,
    onSubmit,
    removeItem,
    isSubmitting,
  } = useHealthPendingReviewForm();

  const { register, setValue, watch, formState } = formMethods;
  const examType = watch('examType');

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');
  const dangerColor = getColor('status.error');
  const warningColor = getColor('status.warning');

  const handleDiscard = async () => {
    await discardMutation.mutateAsync(id!);
    navigate('/new-resources/health/exams?tab=processing');
  };

  if (isLoading) {
    return (
      <FixedAppShell bg={bg}>
        <Flex flex={1} justify="center" align="center"><Spinner /></Flex>
      </FixedAppShell>
    );
  }

  if (!processing) {
    return (
      <FixedAppShell bg={bg}>
        <PageTitleBar title={t('health.pending.detail.title')} backTo="/new-resources/health/exams?tab=processing" />
        <Flex flex={1} justify="center" align="center">
          <Text color={textSub}>{t('health.pending.notFound')}</Text>
        </Flex>
      </FixedAppShell>
    );
  }

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar title={t('health.pending.detail.title')} backTo="/new-resources/health/exams?tab=processing" />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box as="form" onSubmit={onSubmit} width="100%" maxW="600px">
          <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={1}>
              {processing.originalFilename}
            </Text>
            <Text color={textSub} fontSize="xs">
              {t('health.pending.for')}: {processing.targetUser?.name}
            </Text>
          </Box>

          <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={3}>
              {t('health.pending.detail.reviewData')}
            </Text>
            <Stack spacing={3}>
              <Flex gap={2}>
                <FormControl>
                  <FormLabel color={textPrimary} fontSize="xs">{t('health.register.examType')}</FormLabel>
                  <Select
                    bg={inputBg}
                    size="sm"
                    {...register('examType')}
                    onChange={(e) => setValue('examType', e.target.value as HealthExamType)}
                    color={textPrimary}
                  >
                    {examTypeOptions.map((et) => (
                      <option key={et.value} value={et.value}>{et.label}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color={textPrimary} fontSize="xs">{t('health.register.examDate')}</FormLabel>
                  <Input bg={inputBg} size="sm" type="date" {...register('examDate')} color={textPrimary} />
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel color={textPrimary} fontSize="xs">{t('health.register.labName')}</FormLabel>
                <Input bg={inputBg} size="sm" {...register('labName')} color={textPrimary} />
              </FormControl>
              <FormControl>
                <FormLabel color={textPrimary} fontSize="xs">{t('health.register.doctorName')}</FormLabel>
                <Input bg={inputBg} size="sm" {...register('doctorName')} color={textPrimary} />
              </FormControl>
              <FormControl>
                <FormLabel color={textPrimary} fontSize="xs">{t('health.register.notes')}</FormLabel>
                <Textarea bg={inputBg} size="sm" {...register('notes')} color={textPrimary} rows={2} />
              </FormControl>
            </Stack>
          </Box>

          <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={3}>
              {t('health.pending.detail.extractedItems')} ({itemsFieldArray.fields.length})
            </Text>
            {formState.errors.items?.message && (
              <Text color={dangerColor} fontSize="xs" mb={2}>{formState.errors.items.message}</Text>
            )}
            <Stack spacing={3}>
              {itemsFieldArray.fields.map((field, idx) => {
                const isAbnormal = watch(`items.${idx}.isAbnormal`);

                return (
                  <Box key={field.id} bg={inputBg} borderRadius="md" borderWidth="1px" borderColor={borderColor} p={3}>
                    <Flex justify="space-between" align="center" mb={2}>
                      <FormControl flex={1} mr={2} isInvalid={!!formState.errors.items?.[idx]?.itemName}>
                        <Input size="xs" fontWeight="semibold" {...register(`items.${idx}.itemName`)} color={textPrimary} />
                        <FormErrorMessage fontSize="xs">{formState.errors.items?.[idx]?.itemName?.message}</FormErrorMessage>
                      </FormControl>
                      {isAbnormal && (
                        <Badge bg={warningColor} color={textPrimary} size="sm">{t('health.common.abnormal')}</Badge>
                      )}
                      <Button size="xs" variant="ghost" color={dangerColor} ml={1} onClick={() => removeItem(idx)}>
                        <Icon as={FiTrash2} />
                      </Button>
                    </Flex>

                    {examType === 'LABORATORY' ? (
                      <>
                        <Flex gap={2} wrap="wrap" mb={1}>
                          <Input size="xs" flex={1} minW="80px" placeholder={t('health.register.resultValue')} {...register(`items.${idx}.resultValue`)} color={textPrimary} />
                          <Input size="xs" w="70px" placeholder={t('health.register.resultUnit')} {...register(`items.${idx}.resultUnit`)} color={textPrimary} />
                          <Input size="xs" flex={1} minW="120px" placeholder={t('health.register.referenceRange')} {...register(`items.${idx}.referenceRange`)} color={textPrimary} />
                        </Flex>
                        <Textarea size="xs" {...register(`items.${idx}.itemNotes`)} placeholder={t('health.register.itemNotes')} color={textPrimary} rows={2} />
                      </>
                    ) : (
                      <>
                        <Textarea size="xs" {...register(`items.${idx}.findings`)} placeholder={t('health.register.findings')} color={textPrimary} rows={3} mb={1} />
                        <Textarea size="xs" {...register(`items.${idx}.conclusion`)} placeholder={t('health.register.conclusion')} color={textPrimary} rows={2} />
                      </>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>

          <Flex gap={3}>
            <Button
              type="submit"
              flex={1}
              bg={primaryBtnBg}
              color={primaryBtnText}
              _hover={{ opacity: 0.9 }}
              leftIcon={<Icon as={FiCheckCircle} />}
              isLoading={isSubmitting}
            >
              {t('health.pending.detail.save')}
            </Button>
            <Button
              variant="outline"
              borderColor={dangerColor}
              color={dangerColor}
              leftIcon={<Icon as={FiTrash2} />}
              isLoading={discardMutation.isPending}
              onClick={handleDiscard}
            >
              {t('health.pending.detail.discard')}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
