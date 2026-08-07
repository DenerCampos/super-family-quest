import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAdminFamilyMembers } from '../../hooks/useAdminFamilyMembers';
import { useUploadHealthFiles } from '../../hooks/useHealthExams';
import { useHealthExamRegisterForm } from '../../hooks/useHealthExamRegisterForm';
import {
  getHealthExamTypeOptions,
} from '../../utils/healthConstants';
import { formatHealthMaxUploadMb, validateHealthUploadFiles } from '../../utils/healthUpload';
import type { HealthExamType } from '../../types/health';

export const HealthRegisterView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { members: adminMembers, isAdminAnywhere: userIsAdmin } =
    useAdminFamilyMembers();

  const {
    formMethods,
    itemsFieldArray,
    examType,
    onSubmit,
    addItem,
    removeItem,
    isSubmitting,
  } = useHealthExamRegisterForm();

  const { register, setValue, watch, formState } = formMethods;
  const uploadMutation = useUploadHealthFiles();
  const examTypeOptions = getHealthExamTypeOptions(t);

  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const merged = [...selectedFiles, ...files];
    const validation = validateHealthUploadFiles(merged);
    if (!validation.ok) {
      if (validation.reason === 'size') {
        setUploadError(t('health.toast.fileTooLarge'));
      } else if (validation.reason === 'type') {
        setUploadError(t('health.toast.invalidFileType'));
      }
      e.target.value = '';
      return;
    }
    setUploadError('');
    setSelectedFiles(merged);
    e.target.value = '';
  };

  const handleRemoveFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setUploadError('');
  };

  const handleUploadSubmit = async () => {
    const validation = validateHealthUploadFiles(selectedFiles);
    if (!validation.ok) {
      if (validation.reason === 'size') {
        setUploadError(t('health.toast.fileTooLarge'));
      } else if (validation.reason === 'type') {
        setUploadError(t('health.toast.invalidFileType'));
      }
      return;
    }
    await uploadMutation.mutateAsync({
      files: validation.files,
      targetUserId: watch('targetUserId') || undefined,
    });
    setSelectedFiles([]);
    setUploadError('');
    navigate('/new-resources/health/exams?tab=processing');
  };

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');
  const dangerColor = getColor('status.error');

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar title={t('health.register.title')} backTo="/new-resources/health/exams" />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box width="100%" maxW="600px">
          {userIsAdmin && adminMembers.length > 0 && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
              <FormControl>
                <FormLabel color={textPrimary} fontSize="sm">
                  {t('health.register.targetMember')}
                </FormLabel>
                <Select
                  bg={inputBg}
                  {...register('targetUserId')}
                  placeholder={t('health.register.targetMemberPlaceholder')}
                  size="sm"
                  color={textPrimary}
                >
                  {adminMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Tabs variant="enclosed">
            <TabList borderColor={borderColor}>
              <Tab color={textPrimary} fontSize="sm" _selected={{ color: primaryBtnText, bg: primaryBtnBg }}>
                <Icon as={FiPlus} mr={2} />
                {t('health.register.tabs.manual')}
              </Tab>
              <Tab color={textPrimary} fontSize="sm" _selected={{ color: primaryBtnText, bg: primaryBtnBg }}>
                <Icon as={FiUpload} mr={2} />
                {t('health.register.tabs.upload')}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0} pt={3}>
                <Box as="form" onSubmit={onSubmit} bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4}>
                  <Stack spacing={3}>
                    <FormControl isRequired isInvalid={!!formState.errors.examType}>
                      <FormLabel color={textPrimary} fontSize="sm">{t('health.register.examType')}</FormLabel>
                      <Select
                        bg={inputBg}
                        {...register('examType')}
                        onChange={(e) => setValue('examType', e.target.value as HealthExamType)}
                        size="sm"
                        color={textPrimary}
                      >
                        {examTypeOptions.map((et) => (
                          <option key={et.value} value={et.value}>{et.label}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textPrimary} fontSize="sm">{t('health.register.labName')}</FormLabel>
                      <Input bg={inputBg} {...register('labName')} placeholder={t('health.register.labNamePlaceholder')} size="sm" color={textPrimary} />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textPrimary} fontSize="sm">{t('health.register.doctorName')}</FormLabel>
                      <Input bg={inputBg} {...register('doctorName')} placeholder={t('health.register.doctorNamePlaceholder')} size="sm" color={textPrimary} />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textPrimary} fontSize="sm">{t('health.register.examDate')}</FormLabel>
                      <Input bg={inputBg} type="date" {...register('examDate')} size="sm" color={textPrimary} />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textPrimary} fontSize="sm">{t('health.register.notes')}</FormLabel>
                      <Textarea bg={inputBg} {...register('notes')} placeholder={t('health.register.notesPlaceholder')} size="sm" color={textPrimary} rows={2} />
                    </FormControl>

                    <Box>
                      <Text fontWeight="semibold" color={textPrimary} fontSize="sm" mb={2}>
                        {t('health.register.items')}
                      </Text>
                      {formState.errors.items?.message && (
                        <Text color={dangerColor} fontSize="xs" mb={2}>
                          {formState.errors.items.message}
                        </Text>
                      )}
                      <Stack spacing={2}>
                        {itemsFieldArray.fields.map((field, idx) => (
                          <Box key={field.id} bg={inputBg} borderRadius="md" borderWidth="1px" borderColor={borderColor} p={3}>
                            <Stack spacing={2}>
                              <Flex gap={2}>
                                <FormControl flex={1} isInvalid={!!formState.errors.items?.[idx]?.itemName}>
                                  <Input
                                    size="xs"
                                    placeholder={t('health.register.itemName')}
                                    {...register(`items.${idx}.itemName`)}
                                    color={textPrimary}
                                  />
                                  <FormErrorMessage fontSize="xs">
                                    {formState.errors.items?.[idx]?.itemName?.message}
                                  </FormErrorMessage>
                                </FormControl>
                                <Button size="xs" variant="ghost" color={dangerColor} onClick={() => removeItem(idx)}>
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
                                  <Textarea size="xs" placeholder={t('health.register.itemNotes')} {...register(`items.${idx}.itemNotes`)} color={textPrimary} rows={2} />
                                </>
                              ) : (
                                <>
                                  <Textarea size="xs" placeholder={t('health.register.findings')} {...register(`items.${idx}.findings`)} color={textPrimary} rows={2} />
                                  <Textarea size="xs" placeholder={t('health.register.conclusion')} {...register(`items.${idx}.conclusion`)} color={textPrimary} rows={2} />
                                </>
                              )}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>

                      <Button size="xs" variant="outline" leftIcon={<Icon as={FiPlus} />} mt={2} onClick={addItem}>
                        {t('health.register.addItem')}
                      </Button>
                    </Box>

                    <Button type="submit" size="sm" bg={primaryBtnBg} color={primaryBtnText} _hover={{ opacity: 0.9 }} isLoading={isSubmitting}>
                      {t('health.register.save')}
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>

              <TabPanel px={0} pt={3}>
                <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4}>
                  <Stack spacing={4}>
                    <Text color={textSub} fontSize="sm">{t('health.register.uploadHint')}</Text>

                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      borderWidth="2px"
                      borderStyle="dashed"
                      borderColor={borderColor}
                      borderRadius="md"
                      p={6}
                      cursor="pointer"
                      onClick={() => fileRef.current?.click()}
                      gap={2}
                    >
                      <Icon as={FiUpload} boxSize={8} color={textSub} />
                      <Text color={textSub} fontSize="sm" textAlign="center">{t('health.register.clickToSelect')}</Text>
                      <Text color={textSub} fontSize="xs">
                        {t('health.upload.fileFormats', { maxMb: formatHealthMaxUploadMb() })}
                      </Text>
                    </Flex>

                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />

                    {uploadError && (
                      <Text color={dangerColor} fontSize="xs">{uploadError}</Text>
                    )}

                    {selectedFiles.length > 0 && (
                      <Stack spacing={1}>
                        {selectedFiles.map((f, idx) => (
                          <Flex key={`${f.name}-${idx}`} justify="space-between" align="center" bg={inputBg} borderRadius="md" px={3} py={2}>
                            <Text color={textPrimary} fontSize="xs" noOfLines={1}>{f.name}</Text>
                            <Button size="xs" variant="ghost" color={dangerColor} onClick={() => handleRemoveFile(idx)}>
                              <Icon as={FiTrash2} />
                            </Button>
                          </Flex>
                        ))}
                      </Stack>
                    )}

                    <Button
                      size="sm"
                      bg={primaryBtnBg}
                      color={primaryBtnText}
                      _hover={{ opacity: 0.9 }}
                      leftIcon={<Icon as={FiUpload} />}
                      isDisabled={selectedFiles.length === 0}
                      isLoading={uploadMutation.isPending}
                      onClick={handleUploadSubmit}
                    >
                      {t('health.register.uploadAndProcess')} ({selectedFiles.length})
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
