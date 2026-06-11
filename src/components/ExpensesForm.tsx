import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FiCamera,
  FiChevronDown,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";
import {
  useExpenseFormAutofill,
  useExpenseFormSubmit,
} from "../hooks/useExpenseForm";
import type { ExpenseFormValues } from "../hooks/useExpenseFormSubmit";
import { useFinancialPhotoEdits } from "../hooks/useFinancialPhotoEdits";
import { useGetAutoFillExpenses } from "../hooks/useGetAutoFillExpenses";
import { useThemedTranslation } from "../hooks/useThemedTranslation";
import { useVisualTheme } from "../hooks/useVisualTheme";
import { api } from "../services";
import type { ExpenseComplete } from "../services/expense";
import {
  formatCurrency,
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from "../utils/formatCurrency";
import { formatGramsInput, parseGrams, formatIntegerQuantityInput, isExpenseDiscreteCountUnit } from "../utils/formatGrams";
import { AutocompleteInput } from "./AutocompleteInput";
import {
  ResourceFormStepper,
} from "./form-stepper/ResourceFormStepper";
import { FinancialFormFooter } from "./form-stepper/FinancialFormFooter";
import { FinancialFormLayout } from "./form-stepper/FinancialFormLayout";
import { StepSwipePanels } from "./form-stepper/StepSwipePanels";
import { useFormStepper } from "./form-stepper/useFormStepper";
import { RecurrenceStep } from "./financial-steps/RecurrenceStep";
import { WarrantyStep } from "./financial-steps/WarrantyStep";
import { PhotosStep } from "./financial-steps/PhotosStep";

interface IExpensesFormProps {
  isEdit: boolean;
  id?: string;
  onPhotoChangesChange?: (hasChanges: boolean) => void;
}

const inputStyle = (getColor: (path: string) => string) => ({
  bg: getColor("input.background"),
  color: getColor("text.primary"),
  _focus: {
    borderColor: getColor("input.focus"),
    boxShadow: `0 0 0 1px ${getColor("input.focusBorder")}`,
  },
  sx: {
    "&::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
      cursor: "pointer",
    },
  },
});

const smallInputStyle = (getColor: (path: string) => string) => ({
  ...inputStyle(getColor),
  size: "sm",
});

const itemFieldLabelProps = (getColor: (path: string) => string) => ({
  color: getColor("text.primary"),
  fontSize: "xs",
  mb: 1,
  minH: "28px",
  display: "flex" as const,
  alignItems: "flex-end" as const,
  lineHeight: "1.15",
  noOfLines: 2,
});


const ExpensesForm = ({ isEdit, id, onPhotoChangesChange }: IExpensesFormProps) => {
  const { getColor } = useVisualTheme();
  const [expandedItemIndex, setExpandedItemIndex] = useState<number>(0);
  const [removedItemIds, setRemovedItemIds] = useState<string[]>([]);
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
  const { isOpen: isItemsCollapsed, onToggle: toggleItemsCollapsed } =
    useDisclosure({ defaultIsOpen: isEdit });

  const { data: expenseData } = useQuery<ExpenseComplete>({
    queryKey: ["expense", id],
    queryFn: () => api.getExpenseById(id!),
    enabled: !!id,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    getValues,
    register,
    control,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useFormContext<ExpenseFormValues>();
  const { t } = useThemedTranslation();
  const { fields, remove, append } = useFieldArray({ control, name: "items" });

  const expenseSteps = useMemo(() => [
    { id: 'expense', label: t('financialSteps.expense.title'), icon: FiShoppingBag },
    { id: 'recurrence', label: t('financialSteps.recurrence.title'), optional: true, icon: FiRefreshCw },
    { id: 'warranty', label: t('financialSteps.warranty.title'), optional: true, icon: FiShield },
    { id: 'photos', label: t('financialSteps.photos.title'), optional: true, icon: FiCamera },
  ], [t]);

  const step1Valid =
    !!watch("store.name")?.trim() &&
    !!watch("payment.name")?.trim() &&
    !!watch("date") &&
    !errors.store?.name &&
    !errors.payment?.name &&
    !errors.date &&
    !errors.items;

  const {
    activeIndex,
    stepStates,
    goTo,
  } = useFormStepper(expenseSteps, step1Valid);

  const { data: autofillData } = useGetAutoFillExpenses();

  const stores = autofillData?.stores || [];
  const payments = autofillData?.payments || [];
  const groups = autofillData?.groups || [];

  useExpenseFormAutofill({
    expenseData,
    autofillData,
    isEdit,
    reset,
    setValue,
    watch,
    fields,
    isItemsCollapsed,
    toggleItemsCollapsed,
    onEditPhotosLoaded: setExistingPhotos,
  });

  useEffect(() => {
    onPhotoChangesChange?.(hasPhotoChanges);
  }, [hasPhotoChanges, onPhotoChangesChange]);

  const { onSubmit } = useExpenseFormSubmit({
    isEdit,
    id,
    removedItemIds,
    reset,
    pendingPhotos,
    removedPhotoUrls,
    formDirty: isDirty,
    onPhotosUploaded: clearPhotoEdits,
  });

  const canSubmitEdit = isDirty || hasPhotoChanges;

  const handleAddItem = () => {
    const newIndex = fields.length;
    append({
      ...{
        code: String(newIndex + 1),
        name: "",
        quantity: "1",
        unit: "Unidade",
        value: "0,00",
        total: 0,
        group: {
          name: "",
        },
      },
      group: { name: groups[0]?.name || "" },
    });

    setTimeout(() => {
      setExpandedItemIndex(newIndex);
    }, 0);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
            steps={expenseSteps}
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
        {/* Campo Loja */}
        <FormControl isInvalid={!!errors.store?.name} mb={4}>
          <FormLabel color={getColor("text.primary")}>
            {t("modals.expense.store")}
          </FormLabel>
          <AutocompleteInput
            value={watch("store.name") || ""}
            options={stores.map((store) => store.name)}
            onChange={(value) =>
              setValue("store.name", value, { shouldValidate: true })
            }
            placeholder={t("modals.expense.storePlaceholder")}
          />
          {errors.store?.name && (
            <Text color={getColor("text.error")} fontSize="sm" mt={1}>
              {errors.store.name.message}
            </Text>
          )}
        </FormControl>

        {/* Pagamento e Data */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
          <FormControl isInvalid={!!errors.payment?.name}>
            <FormLabel color={getColor("text.primary")}>
              {t("modals.expense.payment")}
            </FormLabel>
            <AutocompleteInput
              value={watch("payment.name") || ""}
              options={payments.map((payment) => payment.name)}
              onChange={(value) =>
                setValue("payment.name", value, { shouldValidate: true })
              }
              placeholder={t("modals.expense.paymentPlaceholder")}
            />
            {errors.payment?.name && (
              <Text color={getColor("text.error")} fontSize="sm" mt={1}>
                {errors.payment.name.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.date}>
            <FormLabel color={getColor("text.primary")}>
              {t("modals.expense.date")}
            </FormLabel>
            <Input
              type="date"
              {...register("date", {
                required: t("common.required"),
              })}
              {...inputStyle(getColor)}
            />
            {errors.date && (
              <Text color={getColor("text.error")} fontSize="sm" mt={1}>
                {errors.date.message}
              </Text>
            )}
          </FormControl>
        </Grid>

        {/* Seção de Itens */}
        <FormControl isInvalid={!!errors.items}>
          <Flex justify="space-between" align="center" mb={3}>
            <FormLabel color={getColor("text.primary")} mb={0}>
              {t("modals.expense.items")}
            </FormLabel>
            <Button
              size="sm"
              variant="ghost"
              color={getColor("text.inverted")}
              bg={getColor("background.tertiary")}
              _hover={{ bg: getColor("background.button.hover.primary") }}
              onClick={toggleItemsCollapsed}
              rightIcon={
                <Icon
                  as={FiChevronDown}
                  transform={isItemsCollapsed ? "rotate(180deg)" : "none"}
                  transition="transform 0.2s"
                />
              }
            >
              {isItemsCollapsed
                ? t("modals.expense.hideItems")
                : t("modals.expense.showItems")}
            </Button>
          </Flex>

          <Collapse in={isItemsCollapsed} animateOpacity>
            <Box>
              <Accordion
                allowToggle
                index={expandedItemIndex}
                onChange={(index) => setExpandedItemIndex(index as number)}
              >
                {fields.map((field, index) => {
                  const itemUnit = watch(`items.${index}.unit`);
                  const discreteQty = isExpenseDiscreteCountUnit(itemUnit);

                  const unitRegistration = register(`items.${index}.unit`, {
                    required: t("common.required"),
                  });

                  const quantityRegistration = register(
                    `items.${index}.quantity`,
                    {
                      required: t("common.required"),
                      validate: (value) => {
                        const unitNow = getValues(`items.${index}.unit`);
                        const numValue = isExpenseDiscreteCountUnit(unitNow)
                          ? parseInt(
                              String(value ?? "").replace(/\D/g, ""),
                              10
                            )
                          : parseGrams(value);
                        if (Number.isNaN(numValue))
                          return t("common.invalidValue");
                        if (numValue <= 0) return t("common.invalidValue");
                        return true;
                      },
                    }
                  );

                  const { ref: qtyRef, ...qtyRest } = quantityRegistration;

                  const {
                    ref: unitRef,
                    ...unitRest
                  } = unitRegistration;

                  return (
                    <AccordionItem
                      key={field.id}
                      border="1px"
                      borderColor={getColor("border.tertiary")}
                      borderRadius="md"
                      mb={3}
                    >
                      <AccordionButton
                        bg={getColor("background.secondary")}
                        _hover={{
                          bg: getColor("background.button.hover.primary"),
                        }}
                        _expanded={{ bg: getColor("background.tertiary") }}
                        color={getColor("text.inverted")}
                        borderRadius="md"
                      >
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="semibold">
                            Item {index + 1}:{" "}
                            {watch(`items.${index}.name`) || "Novo item"}
                          </Text>
                          <Text fontSize="sm" color={getColor("text.secondary")}>
                            {formatCurrency(
                              parseBRLCurrency(
                                watch(`items.${index}.value`) ?? ""
                              )
                            )}{" "}
                            •{" "}
                            {discreteQty
                              ? Math.max(
                                  1,
                                  Math.round(
                                    parseGrams(
                                      String(
                                        watch(
                                          `items.${index}.quantity`
                                        ) ?? "1"
                                      )
                                    )
                                  )
                                )
                              : parseGrams(
                                  watch(
                                    `items.${index}.quantity`
                                  )?.toString() ?? ""
                                ) || 1}{" "}
                            {watch(`items.${index}.unit`) ||
                              field.unit ||
                              "Unidade"}
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>

                      <AccordionPanel
                        bg={getColor("background.secondary")}
                        pb={4}
                      >
                        <Flex direction="column" gap={4}>
                          {/* Código e Nome */}
                          <Grid templateColumns="64px 1fr" gap={3} alignItems="start">
                            <FormControl
                              isInvalid={!!errors.items?.[index]?.code}
                            >
                              <FormLabel {...itemFieldLabelProps(getColor)}>
                                {t("modals.expense.codeShort")}
                              </FormLabel>
                              <Input
                                {...register(`items.${index}.code`, {
                                  required: t("common.required"),
                                  pattern: {
                                    value: /^[a-zA-Z0-9]+$/,
                                    message: t("common.invalidValue"),
                                  },
                                })}
                                {...smallInputStyle(getColor)}
                                size="sm"
                              />
                              {errors.items?.[index]?.code && (
                                <Text color="red.300" fontSize="xs" mt={1}>
                                  {errors.items[index]?.code?.message}
                                </Text>
                              )}
                            </FormControl>

                            <FormControl
                              isInvalid={!!errors.items?.[index]?.name}
                            >
                              <FormLabel {...itemFieldLabelProps(getColor)}>
                                {t("modals.expense.name")}
                              </FormLabel>
                              <Input
                                {...register(`items.${index}.name`, {
                                  required: t("common.required"),
                                  minLength: {
                                    value: 3,
                                    message: t("common.minLength", {
                                      count: 3,
                                    }),
                                  },
                                })}
                                {...smallInputStyle(getColor)}
                                size="sm"
                              />
                              {errors.items?.[index]?.name && (
                                <Text color="red.300" fontSize="xs" mt={1}>
                                  {errors.items[index]?.name?.message}
                                </Text>
                              )}
                            </FormControl>
                          </Grid>

                          {/* Quantidade, Unidade e Valor */}
                          <Grid
                            templateColumns="1fr 1fr minmax(72px, 1fr)"
                            gap={3}
                            alignItems="start"
                          >
                            <FormControl
                              isInvalid={!!errors.items?.[index]?.quantity}
                            >
                              <FormLabel {...itemFieldLabelProps(getColor)}>
                                {t("modals.expense.quantityShort")}
                              </FormLabel>
                              <Input
                                type="text"
                                inputMode={
                                  discreteQty ? "numeric" : "decimal"
                                }
                                ref={qtyRef}
                                {...qtyRest}
                                onChange={(e) => {
                                  const unitNow = getValues(
                                    `items.${index}.unit`
                                  );
                                  const formatted =
                                    isExpenseDiscreteCountUnit(unitNow)
                                      ? formatIntegerQuantityInput(
                                          e.target.value
                                        )
                                      : formatGramsInput(e.target.value);
                                  setValue(
                                    `items.${index}.quantity`,
                                    formatted,
                                    {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    }
                                  );
                                }}
                                {...smallInputStyle(getColor)}
                                size="sm"
                              />
                              {errors.items?.[index]?.quantity && (
                                <Text
                                  color={getColor("text.error")}
                                  fontSize="xs"
                                  mt={1}
                                >
                                  {errors.items[index]?.quantity?.message}
                                </Text>
                              )}
                            </FormControl>

                            <FormControl
                              isInvalid={!!errors.items?.[index]?.unit}
                            >
                              <FormLabel {...itemFieldLabelProps(getColor)}>
                                {t("modals.expense.unit")}
                              </FormLabel>
                              <Input
                                ref={unitRef}
                                {...unitRest}
                                onChange={(e) => {
                                  unitRegistration.onChange(e);
                                  if (
                                    isExpenseDiscreteCountUnit(e.target.value)
                                  ) {
                                    const q = getValues(
                                      `items.${index}.quantity`
                                    );
                                    const coerced = String(
                                      Math.max(
                                        1,
                                        Math.round(
                                          parseGrams(String(q))
                                        )
                                      )
                                    );
                                    setValue(
                                      `items.${index}.quantity`,
                                      coerced,
                                      {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      }
                                    );
                                  }
                                }}
                                {...smallInputStyle(getColor)}
                                size="sm"
                              />
                              {errors.items?.[index]?.unit && (
                                <Text
                                  color={getColor("text.error")}
                                  fontSize="xs"
                                  mt={1}
                                >
                                  {errors.items[index]?.unit?.message}
                                </Text>
                              )}
                            </FormControl>

                            <FormControl
                              isInvalid={!!errors.items?.[index]?.value}
                            >
                              <FormLabel {...itemFieldLabelProps(getColor)}>
                                {t("modals.expense.unitValueShort")}
                              </FormLabel>
                              <Input
                                type="text"
                                {...register(`items.${index}.value`, {
                                  required: "Campo obrigatório",
                                  validate: (value) => {
                                    const numericValue =
                                      parseBRLCurrency(value);
                                    if (isNaN(numericValue))
                                      return t("common.invalidValue");
                                    return (
                                      numericValue >= 0 ||
                                      t("common.invalidValue")
                                    );
                                  },
                                })}
                                onChange={(e) => {
                                  const formatted = formatCurrencyInputBRL(
                                    e.target.value
                                  );
                                  setValue(`items.${index}.value`, formatted, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                                {...smallInputStyle(getColor)}
                                size="sm"
                              />
                              {errors.items?.[index]?.value && (
                                <Text
                                  color={getColor("text.error")}
                                  fontSize="xs"
                                  mt={1}
                                >
                                  {errors.items[index]?.value?.message}
                                </Text>
                              )}
                            </FormControl>
                          </Grid>

                          {/* Grupo - Linha separada */}
                          <FormControl
                            isInvalid={!!errors.items?.[index]?.group?.name}
                          >
                            <FormLabel
                              color={getColor("text.primary")}
                              fontSize="sm"
                            >
                              {t("modals.expense.group")}
                            </FormLabel>
                            <AutocompleteInput
                              value={watch(`items.${index}.group.name`) || ""}
                              options={groups.map((group) => group.name)}
                              onChange={(value) =>
                                setValue(`items.${index}.group.name`, value, {
                                  shouldValidate: true,
                                })
                              }
                              placeholder="Selecione ou digite um grupo"
                            />
                            {errors.items?.[index]?.group?.name && (
                              <Text
                                color={getColor("text.error")}
                                fontSize="xs"
                                mt={1}
                              >
                                {errors.items[index]?.group?.name?.message}
                              </Text>
                            )}
                          </FormControl>

                          {/* Botão Remover */}
                          <Flex justify="flex-end">
                            <Button
                              onClick={() => {
                                const item = watch(`items.${index}`);
                                if (item.id && typeof item.id === "string") {
                                  setRemovedItemIds((prev) => [
                                    ...prev,
                                    item.id as string,
                                  ]);
                                }
                                remove(index);
                              }}
                              colorScheme={getColor("chakraColors.red")}
                              size="sm"
                              isDisabled={fields.length <= 1}
                            >
                              {t("modals.expense.removeItem")}
                            </Button>
                          </Flex>
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              <Button
                onClick={handleAddItem}
                mt={4}
                w="full"
                variant="outline"
                color={getColor("text.primary")}
                bg={getColor("background.tertiary")}
                border="1px solid"
                borderColor={getColor("border.primary")}
                _hover={{
                  bg: getColor("background.selected"),
                  color: getColor("text.financial.accent"),
                }}
              >
                {t("modals.expense.addItem")}
              </Button>
            </Box>
          </Collapse>
        </FormControl>
              </>,
              <RecurrenceStep key="recurrence" />,
              <WarrantyStep key="warranty" />,
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
            isEdit={isEdit}
          />
        }
      />
    </form>
  );
};

export default ExpensesForm;
