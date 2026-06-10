import {
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { FiCamera, FiDollarSign, FiRefreshCw } from "react-icons/fi";
import type { Revenue } from "../services/revenue";
import type { RecurrenceForm } from "../types/financial";
import { useFinancialPhotoEdits } from "../hooks/useFinancialPhotoEdits";
import { useThemedTranslation } from "../hooks/useThemedTranslation";
import { useVisualTheme } from "../hooks/useVisualTheme";
import {
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from "../utils/formatCurrency";
import {
  ResourceFormStepper,
} from "./form-stepper/ResourceFormStepper";
import { FinancialFormFooter } from "./form-stepper/FinancialFormFooter";
import { FinancialFormLayout } from "./form-stepper/FinancialFormLayout";
import { StepSwipePanels } from "./form-stepper/StepSwipePanels";
import { useFormStepper } from "./form-stepper/useFormStepper";
import { RecurrenceStep } from "./financial-steps/RecurrenceStep";
import { PhotosStep } from "./financial-steps/PhotosStep";
import { api } from "../services";
import { REVENUE_QUERY_KEY } from "../pages/Revenue";

export type RevenueFormData = {
  name: string;
  value: string;
  date: string;
  repeat: boolean;
  recurrence?: RecurrenceForm;
};


interface RevenueFormProps {
  onSubmit: (
    data: RevenueFormData,
    pendingPhotos: File[],
    removedPhotoUrls: string[],
    formDirty: boolean,
  ) => Promise<void>;
  isEdit?: boolean;
  id?: string;
  onPhotoChangesChange?: (hasChanges: boolean) => void;
}

export const RevenueForm = ({
  onSubmit,
  isEdit,
  id,
  onPhotoChangesChange,
}: RevenueFormProps) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const location = useLocation();
  const {
    pendingPhotos,
    existingPhotos,
    removedPhotoUrls,
    hasPhotoChanges,
    setExistingPhotos,
    addPending,
    removePending,
    markExistingForRemoval,
    clearPhotoEdits,
  } = useFinancialPhotoEdits();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useFormContext<RevenueFormData>();

  const revenueSteps = useMemo(() => [
    { id: 'revenue', label: t('financialSteps.revenue.title'), icon: FiDollarSign },
    { id: 'recurrence', label: t('financialSteps.recurrence.title'), optional: true, icon: FiRefreshCw },
    { id: 'photos', label: t('financialSteps.photos.title'), optional: true, icon: FiCamera },
  ], [t]);

  const step1Valid =
    !!watch("name")?.trim() &&
    !!watch("value") &&
    !!watch("date") &&
    !errors.name &&
    !errors.value &&
    !errors.date;

  const { activeIndex, stepStates, goTo } =
    useFormStepper(revenueSteps, step1Valid);

  useEffect(() => {
    // Preencher formulário a partir de dados de cupom — executa apenas na montagem
    const couponData = location.state?.couponData as Revenue | undefined;
    if (couponData) {
      reset({
        name: couponData.name,
        value: formatCurrencyInputBRL(couponData.value.toString()),
        date: couponData.date,
        repeat: couponData.repeat,
        recurrence: {
          enabled: false,
          mode: 'none',
          count: 2,
          intervalUnit: 'months',
          intervalValue: 1,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intencionalmente sem deps: lê estado de navegação apenas na montagem

  const { data: revenueData } = useQuery<Revenue>({
    queryKey: [REVENUE_QUERY_KEY, id],
    queryFn: () => api.getRevenueById(id!),
    enabled: !!id && !!isEdit,
  });

  useEffect(() => {
    if (revenueData?.photos) {
      setExistingPhotos(revenueData.photos);
    }
  }, [revenueData?.photos, setExistingPhotos]);

  useEffect(() => {
    onPhotoChangesChange?.(hasPhotoChanges);
  }, [hasPhotoChanges, onPhotoChangesChange]);

  const canSubmitEdit = isDirty || hasPhotoChanges;

  const submit = handleSubmit(async (data) => {
    await onSubmit(data, pendingPhotos, removedPhotoUrls, isDirty);
    clearPhotoEdits();
  });

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        height: "100%",
      }}
    >
      <FinancialFormLayout
        stepper={
          <ResourceFormStepper
            steps={revenueSteps}
            activeIndex={activeIndex}
            stepStates={stepStates}
            onStepClick={goTo}
          />
        }
        content={
          <StepSwipePanels
            activeIndex={activeIndex}
            onStepChange={goTo}
            stepStates={stepStates}
            swipeEnabled={step1Valid}
            panels={[
              <>
          <FormControl isInvalid={!!errors.name} mb={4}>
            <FormLabel color={getColor("text.primary")}>
              {t("modals.revenue.name")}
            </FormLabel>
            <Input
              {...register("name", {
                required: t("common.required"),
                minLength: {
                  value: 3,
                  message: t("common.minLength", { count: 3 }),
                },
              })}
              bg={getColor("input.background")}
              color={getColor("text.primary")}
              placeholder={t("modals.revenue.namePlaceholder")}
              isDisabled={isSubmitting}
            />
            {errors.name && (
              <Text color={getColor("status.error")} fontSize="sm" mt={1}>
                {errors.name.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.value} mb={4}>
            <FormLabel color={getColor("text.primary")}>
              {t("modals.revenue.value")}
            </FormLabel>
            <Input
              value={watch("value")}
              {...register("value", {
                required: t("common.required"),
                validate: (value) => {
                  const numericValue = parseBRLCurrency(value);
                  if (isNaN(numericValue)) return t("common.invalidValue");
                  return numericValue >= 0.01 || t("common.invalidValue");
                },
              })}
              onChange={(e) => {
                const formatted = formatCurrencyInputBRL(e.target.value);
                setValue("value", formatted, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              bg={getColor("input.background")}
              color={getColor("text.primary")}
              placeholder={t("modals.revenue.valuePlaceholder")}
              isDisabled={isSubmitting}
            />
            {errors.value && (
              <Text color={getColor("status.error")} fontSize="sm" mt={1}>
                {errors.value.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.date} mb={4}>
            <FormLabel color={getColor("text.primary")}>
              {t("modals.revenue.date")}
            </FormLabel>
            <Input
              type="date"
              {...register("date", { required: t("common.required") })}
              bg={getColor("input.background")}
              color={getColor("text.primary")}
              sx={{
                "&::-webkit-calendar-picker-indicator": {
                  filter: "invert(1)",
                  cursor: "pointer",
                },
              }}
              isDisabled={isSubmitting}
            />
            {errors.date && (
              <Text color={getColor("status.error")} fontSize="sm" mt={1}>
                {errors.date.message}
              </Text>
            )}
          </FormControl>
              </>,
              <RecurrenceStep key="recurrence" />,
              <PhotosStep
                key="photos"
                pendingFiles={pendingPhotos}
                existingUrls={existingPhotos}
                onAdd={addPending}
                onRemovePending={removePending}
                onRemoveExisting={
                  isEdit ? markExistingForRemoval : undefined
                }
              />,
            ]}
          />
        }
        footer={
          <FinancialFormFooter
            isSubmitDisabled={!isValid || isSubmitting || (isEdit ? !canSubmitEdit : false)}
            isSubmitting={isSubmitting}
            isEdit={!!isEdit}
          />
        }
      />
    </form>
  );
};
