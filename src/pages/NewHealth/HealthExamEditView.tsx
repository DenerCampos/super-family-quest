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
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useHealthExamEditForm } from '../../hooks/useHealthExamEditForm';
import { getHealthExamTypeOptions } from '../../utils/healthConstants';
import type { HealthExamType } from '../../types/health';

export const HealthExamEditView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const examTypeOptions = getHealthExamTypeOptions(t);

  const {
    exam,
    isLoading,
    formMethods,
    itemsFieldArray,
    onSubmit,
    addItem,
    removeItem,
    isSubmitting,
  } = useHealthExamEditForm();

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

  if (isLoading) {
    return (
      <FixedAppShell bg={bg}>
        <Flex flex={1} justify="center" align="center"><Spinner /></Flex>
      </FixedAppShell>
    );
  }

  if (!exam) {
    return (
      <FixedAppShell bg={bg}>
        <PageTitleBar
          title={t('health.exams.form.titleEdit')}
          backTo="/new-resources/health/exams"
        />
        <Flex flex={1} justify="center" align="center">
          <Text color={textSub}>{t('health.exams.notFound')}</Text>
        </Flex>
      </FixedAppShell>
    );
  }

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar
        title={t('health.exams.form.titleEdit')}
        backTo={`/new-resources/health/exams/${exam.id}`}
      />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box as="form" onSubmit={onSubmit} width="100%" maxW="600px">
          {exam.files.length > 0 ? (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
              <Text color={textSub} fontSize="xs">
                {t('health.exams.form.attachmentsReadOnly')}
              </Text>
              <Stack spacing={1} mt={2}>
                {exam.files.map((file) => (
                  <Text key={file.id} color={textPrimary} fontSize="sm">
                    {file.originalFilename ?? t('health.exams.detail.attachmentFallback')}
                  </Text>
                ))}
              </Stack>
            </Box>
          ) : null}

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

            <Button size="xs" variant="outline" leftIcon={<Icon as={FiPlus} />} mt={3} onClick={addItem}>
              {t('health.register.addItem')}
            </Button>
          </Box>

          <Button
            type="submit"
            width="100%"
            bg={primaryBtnBg}
            color={primaryBtnText}
            _hover={{ opacity: 0.9 }}
            leftIcon={<Icon as={FiSave} />}
            isLoading={isSubmitting}
          >
            {t('health.exams.form.save')}
          </Button>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
