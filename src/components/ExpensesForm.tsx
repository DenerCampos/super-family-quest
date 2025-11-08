import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
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
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";
import {
  useExpenseFormAutofill,
  useExpenseFormSubmit,
} from "../hooks/useExpenseForm";
import { useGetAutoFillExpenses } from "../hooks/useGetAutoFillExpenses";
import { useThemedTranslation } from "../hooks/useThemedTranslation";
import { useVisualTheme } from "../hooks/useVisualTheme";
import { api } from "../services";
import type { ExpenseComplete } from "../services/expense";
import type { Expense } from "../services/resources";
import {
  formatCurrency,
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from "../utils/formatCurrency";
import { formatGramsInput, parseGrams } from "../utils/formatGrams";
import { AutocompleteInput } from "./AutocompleteInput";

interface IExpensesFormProps {
  isEdit: boolean;
  id?: string;
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

const ExpensesForm = ({ isEdit, id }: IExpensesFormProps) => {
  const { getColor } = useVisualTheme();
  const [expandedItemIndex, setExpandedItemIndex] = useState<number>(0);
  const [removedItemIds, setRemovedItemIds] = useState<string[]>([]);
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
    register,
    control,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useFormContext<Expense>();
  const { t } = useThemedTranslation();
  const { fields, remove, append } = useFieldArray({ control, name: "items" });

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
  });

  const { onSubmit } = useExpenseFormSubmit({
    isEdit,
    id,
    removedItemIds,
    reset,
  });

  const handleAddItem = () => {
    const newIndex = fields.length;
    append({
      ...{
        code: "1",
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
        minHeight: "100%",
        flex: 1,
      }}
    >
      <Flex direction="column" flex="1">
        {/* Campo Loja */}
        <FormControl isInvalid={!!errors.store?.name} mb={4}>
          <FormLabel>{t("modals.expense.store")}</FormLabel>
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
            <FormLabel>{t("modals.expense.payment")}</FormLabel>
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
            <FormLabel>{t("modals.expense.date")}</FormLabel>
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

        <FormControl mb={4}>
          <Checkbox
            {...register("repeat")}
            defaultChecked={watch("repeat") || false}
            colorScheme={getColor("chakraColors.green")}
            size="lg"
          >
            {t("modals.expense.repeat")}
          </Checkbox>
        </FormControl>

        {/* Seção de Itens */}
        <FormControl isInvalid={!!errors.items}>
          <Flex justify="space-between" align="center" mb={3}>
            <FormLabel mb={0}>{t("modals.expense.items")}</FormLabel>
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
                          <Text fontSize="sm" color={getColor("text.muted")}>
                            {formatCurrency(
                              parseFloat(field.value as string)
                            ) || "0,00"}{" "}
                            • {parseGrams(field.quantity.toString()) || "1"}{" "}
                            {field.unit || "Unidade"}
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
                          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <FormControl
                              isInvalid={!!errors.items?.[index]?.code}
                            >
                              <FormLabel fontSize="sm">
                                {t("modals.expense.code")}
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
                              <FormLabel fontSize="sm">
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
                          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            <FormControl
                              isInvalid={!!errors.items?.[index]?.quantity}
                            >
                              <FormLabel fontSize="sm">
                                {t("modals.expense.quantity")}
                              </FormLabel>
                              <Input
                                type="text"
                                {...register(`items.${index}.quantity`, {
                                  required: t("common.required"),
                                  validate: (value) => {
                                    const numValue = parseGrams(value);
                                    if (isNaN(numValue))
                                      return t("common.invalidValue");
                                    if (numValue <= 0)
                                      return t("common.invalidValue");
                                    return true;
                                  },
                                })}
                                onChange={(e) => {
                                  const formatted = formatGramsInput(
                                    e.target.value
                                  );
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
                              <FormLabel fontSize="sm">
                                {t("modals.expense.unit")}
                              </FormLabel>
                              <Input
                                {...register(`items.${index}.unit`, {
                                  required: t("common.required"),
                                })}
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
                              <FormLabel fontSize="sm">
                                {t("modals.expense.unitValue")}
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
                                      numericValue >= 0.01 ||
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
                            <FormLabel fontSize="sm">
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
                  color: getColor("text.accent"),
                }}
              >
                {t("modals.expense.addItem")}
              </Button>
            </Box>
          </Collapse>
        </FormControl>
      </Flex>

      {/* Botão Salvar */}
      <Flex justify="center" align="center" pb={4} mt="auto" width="100%">
        <Button
          color={getColor("text.primary")}
          bg={getColor("background.tertiary")}
          border="1px solid"
          borderColor={getColor("border.primary")}
          _hover={{
            bg: getColor("background.selected"),
            color: getColor("text.accent"),
          }}
          type="submit"
          w="full"
          size="lg"
          isDisabled={!isValid || isSubmitting || (isEdit ? !isDirty : false)}
          isLoading={isSubmitting}
          loadingText={t("common.saving")}
        >
          {isEdit ? t("common.update") : t("common.save")}
        </Button>
      </Flex>
    </form>
  );
};

export default ExpensesForm;
