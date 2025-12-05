import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { useThemedTranslation } from "../hooks/useThemedTranslation";
import { useVisualTheme } from "../hooks/useVisualTheme";
import {
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from "../utils/formatCurrency";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { Revenue } from "../services/revenue";

export type RevenueFormData = {
  name: string;
  value: string;
  date: string;
  repeat: boolean;
};

interface RevenueFormProps {
  onSubmit: (data: RevenueFormData) => Promise<void>;
  isEdit?: boolean;
  id?: string;
}

export const RevenueForm = ({ onSubmit, isEdit, id }: RevenueFormProps) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
   const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useFormContext<RevenueFormData>();

  useEffect(() => {
    const couponData = location.state?.couponData as Revenue;
    if (couponData) {
      reset({
        name: couponData.name,
        value: formatCurrencyInputBRL(couponData.value.toString()),
        date: couponData.date,
        repeat: couponData.repeat,
      })
    }
  }, [])

  return (
    <form style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Flex direction="column" flex="1">
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
            {...register("date", {
              required: t("common.required"),
            })}
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

        <FormControl mb={4}>
          <Checkbox
            {...register("repeat")}
            colorScheme={getColor("chakraColors.green")}
            size="lg"
            color={getColor("text.primary")}
          >
            {t("modals.revenue.repeat")}
          </Checkbox>
        </FormControl>
      </Flex>

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
          isDisabled={!isValid || isSubmitting || (isEdit ? !isDirty : false)}
          isLoading={isSubmitting}
          loadingText={t("common.saving")}
          width="100%"
          size="lg"
          onClick={handleSubmit(onSubmit)}
        >
          {id ? t("common.update") : t("common.save")}
        </Button>
      </Flex>
    </form>
  );
};
