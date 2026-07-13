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
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiCamera, FiFileText, FiImage, FiMinus, FiPlus } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { CameraCaptureModal } from '../../components/CameraCaptureModal';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { useHealthPrescriptionForm } from '../../hooks/useHealthPrescriptionForm';
import { compressImage } from '../../utils/compressImage';
import {
  getHealthDayOptions,
  HEALTH_UPLOAD_ACCEPT_ATTR,
} from '../../utils/healthConstants';
import { validateHealthUploadFiles } from '../../utils/healthUpload';

export const HealthPrescriptionFormView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();
  const { profile } = useAuth();
  const { familyGroup } = useFamilyGroup({ fetchSummary: false, fetchInvitations: false });
  const userIsAdmin = familyGroup ? isAdmin(familyGroup, profile?.user.id ?? '') : false;
  const dayOptions = getHealthDayOptions(t);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const {
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
    analyzeFromFile,
    isAnalyzing,
    isSubmitting,
  } = useHealthPrescriptionForm();

  const { register, watch, formState } = formMethods;

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');
  const dangerColor = getColor('status.error');
  const selectedDayBg = getColor('button.background.primary');
  const selectedDayText = getColor('button.text.primary');
  const unselectedDayBorder = getColor('border.primary');

  const showUploadError = (reason: 'empty' | 'type' | 'size') => {
    if (reason === 'size') {
      toast({ title: t('health.toast.fileTooLarge'), status: 'error', duration: 3000 });
      return;
    }
    if (reason === 'type') {
      toast({ title: t('health.toast.invalidFileType'), status: 'error', duration: 3000 });
    }
  };

  const handleScanFile = async (file: File) => {
    const validation = validateHealthUploadFiles([file]);
    if (!validation.ok) {
      if (validation.reason !== 'empty') {
        showUploadError(validation.reason);
      }
      return;
    }

    let toAnalyze = validation.files[0];
    if (toAnalyze.type.startsWith('image/')) {
      try {
        toAnalyze = await compressImage(toAnalyze);
      } catch {
        toast({ title: t('common.error'), status: 'error', duration: 3000 });
        return;
      }
      const compressedValidation = validateHealthUploadFiles([toAnalyze]);
      if (!compressedValidation.ok && compressedValidation.reason !== 'empty') {
        showUploadError(compressedValidation.reason);
        return;
      }
    }

    try {
      await analyzeFromFile(toAnalyze);
    } catch {
      // Erro tratado no hook useAnalyzePrescription
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || isAnalyzing) return;
    await handleScanFile(file);
  };

  const openCamera = () => {
    if (isAnalyzing) return;

    if (navigator.mediaDevices) {
      setIsCameraOpen(true);
      return;
    }

    cameraRef.current?.click();
  };

  const handleCameraCapture = async (file: File) => {
    await handleScanFile(file);
  };

  if (isEditing && isLoadingExisting) {
    return (
      <FixedAppShell bg={bg}>
        <Flex flex={1} justify="center" align="center"><Spinner /></Flex>
      </FixedAppShell>
    );
  }

  return (
    <>
      {isAnalyzing && (
        <LoadingOverlay typeLoading="read" text={t('health.prescriptions.form.analyzing')} />
      )}

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title={t('health.prescriptions.form.cameraTitle')}
        instructions={t('health.prescriptions.form.cameraInstructions')}
        fileName="receita.jpg"
      />

      <FixedAppShell bg={bg}>
        <PageTitleBar
          title={isEditing ? t('health.prescriptions.form.titleEdit') : t('health.prescriptions.form.titleNew')}
          backTo={isEditing ? `/new-resources/health/prescriptions/${prescriptionId}` : '/new-resources/health/prescriptions'}
        />

        <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
          <Box as="form" onSubmit={onSubmit} width="100%" maxW="600px">
            {!isEditing && (
              <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
                <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={1}>
                  {t('health.prescriptions.form.scanTitle')}
                </Text>
                <Text color={textSub} fontSize="xs" mb={3}>
                  {t('health.prescriptions.form.scanHint')}
                </Text>

                <Input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  display="none"
                  aria-hidden
                  tabIndex={-1}
                  onChange={handleFileChange}
                />
                <Input
                  ref={galleryRef}
                  type="file"
                  accept={HEALTH_UPLOAD_ACCEPT_ATTR}
                  display="none"
                  aria-hidden
                  tabIndex={-1}
                  onChange={handleFileChange}
                />
                <Input
                  ref={pdfRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  display="none"
                  aria-hidden
                  tabIndex={-1}
                  onChange={handleFileChange}
                />

                <Flex gap={2} wrap="wrap">
                  <Button
                    size="sm"
                    leftIcon={<Icon as={FiCamera} />}
                    variant="outline"
                    color={textPrimary}
                    borderColor={unselectedDayBorder}
                    _hover={{ bg: inputBg }}
                    isDisabled={isAnalyzing}
                    onClick={openCamera}
                  >
                    {t('health.prescriptions.form.scanCamera')}
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={FiImage} />}
                    variant="outline"
                    color={textPrimary}
                    borderColor={unselectedDayBorder}
                    _hover={{ bg: inputBg }}
                    isDisabled={isAnalyzing}
                    onClick={() => galleryRef.current?.click()}
                  >
                    {t('health.prescriptions.form.scanGallery')}
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={FiFileText} />}
                    variant="outline"
                    color={textPrimary}
                    borderColor={unselectedDayBorder}
                    _hover={{ bg: inputBg }}
                    isDisabled={isAnalyzing}
                    onClick={() => pdfRef.current?.click()}
                  >
                    {t('health.prescriptions.form.scanPdf')}
                  </Button>
                </Flex>

                <Text color={textSub} fontSize="xs" mt={3}>
                  {t('health.prescriptions.form.manualHint')}
                </Text>
              </Box>
            )}

            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <Stack spacing={3}>
              {!isEditing && userIsAdmin && familyGroup && (
                <FormControl>
                  <FormLabel color={textPrimary} fontSize="sm">{t('health.register.targetMember')}</FormLabel>
                  <Select bg={inputBg} size="sm" {...register('targetUserId')} color={textPrimary}>
                    <option value="">{t('health.register.targetMemberPlaceholder')}</option>
                    {familyGroup.members.map((m) => (
                      <option key={m.user?.id} value={m.user?.id ?? ''}>{m.user?.name}</option>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl isRequired isInvalid={!!formState.errors.doctorName}>
                <FormLabel color={textPrimary} fontSize="sm">{t('health.prescriptions.form.doctorName')}</FormLabel>
                <Input bg={inputBg} size="sm" {...register('doctorName')} color={textPrimary} />
                <FormErrorMessage fontSize="xs">{formState.errors.doctorName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formState.errors.prescriptionDate}>
                <FormLabel color={textPrimary} fontSize="sm">{t('health.prescriptions.form.prescriptionDate')}</FormLabel>
                <Input bg={inputBg} size="sm" type="date" {...register('prescriptionDate')} color={textPrimary} />
                <FormErrorMessage fontSize="xs">{formState.errors.prescriptionDate?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel color={textPrimary} fontSize="sm">{t('health.prescriptions.form.notes')}</FormLabel>
                <Textarea bg={inputBg} size="sm" {...register('notes')} color={textPrimary} rows={2} />
              </FormControl>
            </Stack>
          </Box>

          <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={2}>
            {t('health.prescriptions.form.medications')}
          </Text>
          {formState.errors.items?.message && (
            <Text color={dangerColor} fontSize="xs" mb={2}>{formState.errors.items.message}</Text>
          )}

          <Stack spacing={4} mb={4}>
            {itemsFieldArray.fields.map((field, idx) => {
              const daysOfWeek = watch(`items.${idx}.daysOfWeek`);
              const scheduleTimes = watch(`items.${idx}.scheduleTimes`) ?? [];

              return (
                <Box key={field.id} bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4}>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text color={textPrimary} fontSize="sm" fontWeight="semibold">
                      {t('health.prescriptions.form.medication')} {idx + 1}
                    </Text>
                    {itemsFieldArray.fields.length > 1 && (
                      <Button size="xs" variant="ghost" color={dangerColor} onClick={() => removeMedication(idx)}>
                        <Icon as={FiMinus} />
                      </Button>
                    )}
                  </Flex>

                  <Stack spacing={2}>
                    <FormControl isRequired isInvalid={!!formState.errors.items?.[idx]?.medicationName}>
                      <FormLabel color={textPrimary} fontSize="xs">{t('health.prescriptions.form.medicationName')}</FormLabel>
                      <Input bg={inputBg} size="xs" {...register(`items.${idx}.medicationName`)} color={textPrimary} />
                      <FormErrorMessage fontSize="xs">{formState.errors.items?.[idx]?.medicationName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textPrimary} fontSize="xs">{t('health.prescriptions.form.dosage')}</FormLabel>
                      <Input bg={inputBg} size="xs" placeholder={t('health.prescriptions.form.dosagePlaceholder')} {...register(`items.${idx}.dosage`)} color={textPrimary} />
                    </FormControl>

                    <Box>
                      <Text color={textPrimary} fontSize="xs" mb={1}>{t('health.prescriptions.form.scheduleTimes')}</Text>
                      <Stack spacing={1}>
                        {scheduleTimes.map((_time, tIdx) => (
                          <Flex key={`${field.id}-time-${tIdx}`} gap={2} align="center">
                            <Input
                              bg={inputBg}
                              size="xs"
                              type="time"
                              {...register(`items.${idx}.scheduleTimes.${tIdx}`)}
                              color={textPrimary}
                              w="110px"
                            />
                            {scheduleTimes.length > 1 && (
                              <Button size="xs" variant="ghost" color={dangerColor} onClick={() => removeScheduleTime(idx, tIdx)}>
                                <Icon as={FiMinus} />
                              </Button>
                            )}
                          </Flex>
                        ))}
                      </Stack>
                      <Button size="xs" variant="ghost" leftIcon={<Icon as={FiPlus} />} mt={1} onClick={() => addScheduleTime(idx)} color={textSub}>
                        {t('health.prescriptions.form.addTime')}
                      </Button>
                    </Box>

                    <Box>
                      <Text color={textPrimary} fontSize="xs" mb={1}>{t('health.prescriptions.form.daysOfWeek')}</Text>
                      <Flex gap={1} wrap="wrap">
                        {dayOptions.map((d) => {
                          const isAll = daysOfWeek === null;
                          const isSelected = isAll || (daysOfWeek ?? []).includes(d.key);
                          return (
                            <Button
                              key={d.key}
                              size="xs"
                              bg={isSelected ? selectedDayBg : 'transparent'}
                              color={isSelected ? selectedDayText : textPrimary}
                              borderWidth="1px"
                              borderColor={isSelected ? selectedDayBg : unselectedDayBorder}
                              variant={isSelected ? 'solid' : 'outline'}
                              onClick={() => toggleDay(idx, d.key)}
                            >
                              {d.label}
                            </Button>
                          );
                        })}
                        <Button
                          size="xs"
                          bg={daysOfWeek === null ? selectedDayBg : 'transparent'}
                          color={daysOfWeek === null ? selectedDayText : textPrimary}
                          borderWidth="1px"
                          borderColor={daysOfWeek === null ? selectedDayBg : unselectedDayBorder}
                          variant={daysOfWeek === null ? 'solid' : 'outline'}
                          onClick={() => setEveryDay(idx)}
                        >
                          {t('health.prescriptions.form.everyDay')}
                        </Button>
                      </Flex>
                    </Box>

                    <Flex gap={2}>
                      <FormControl>
                        <FormLabel color={textPrimary} fontSize="xs">{t('health.prescriptions.form.startDate')}</FormLabel>
                        <Input bg={inputBg} size="xs" type="date" {...register(`items.${idx}.startDate`)} color={textPrimary} />
                      </FormControl>
                      <FormControl>
                        <FormLabel color={textPrimary} fontSize="xs">{t('health.prescriptions.form.endDate')}</FormLabel>
                        <Input bg={inputBg} size="xs" type="date" {...register(`items.${idx}.endDate`)} color={textPrimary} />
                        <Text color={textSub} fontSize="9px" mt={0.5}>{t('health.prescriptions.form.endDateHint')}</Text>
                      </FormControl>
                    </Flex>

                    <FormControl>
                      <FormLabel color={textPrimary} fontSize="xs">{t('health.prescriptions.form.itemNotes')}</FormLabel>
                      <Textarea bg={inputBg} size="xs" {...register(`items.${idx}.notes`)} color={textPrimary} rows={2} />
                    </FormControl>
                  </Stack>
                </Box>
              );
            })}
          </Stack>

          <Button variant="outline" size="sm" leftIcon={<Icon as={FiPlus} />} onClick={addMedication} mb={4} width="100%">
            {t('health.prescriptions.form.addMedication')}
          </Button>

          <Button type="submit" size="sm" width="100%" bg={primaryBtnBg} color={primaryBtnText} _hover={{ opacity: 0.9 }} isLoading={isSubmitting}>
            {t('health.prescriptions.form.save')}
          </Button>
        </Box>
      </Flex>
    </FixedAppShell>
    </>
  );
};
