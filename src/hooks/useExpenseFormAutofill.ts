import { useEffect, useRef } from "react";
import type {
  FieldArrayWithId,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useLocation } from "react-router-dom";
import type { ExpenseComplete } from "../services/expense";
import type { ExpenseFormValues } from "./useExpenseFormSubmit";
import { formatCurrencyInputBRL } from "../utils/formatCurrency";
import { formatGramsDisplay } from "../utils/formatGrams";
import {
  buildRecurrenceFromRecord,
} from "../utils/financialFormMapper";
import { formatDateToYYYYMMDD } from "../utils/formatDate";

interface AutofillData {
  stores: Array<{ name: string }>;
  payments: Array<{ name: string }>;
  groups: Array<{ name: string }>;
}

interface CouponItem {
  code: string;
  name: string;
  quantity: number;
  value: string;
  unit: string;
  group: { name: string };
  total: number;
}

interface CouponData {
  name: string;
  uri?: string;
  date: string;
  repeat?: boolean;
  value: number;
  store: { name: string };
  payment: { name: string };
  items: CouponItem[];
}

interface UseExpenseFormAutofillProps {
  expenseData: ExpenseComplete | undefined;
  autofillData: AutofillData | undefined;
  isEdit: boolean;
  reset: UseFormReset<ExpenseFormValues>;
  setValue: UseFormSetValue<ExpenseFormValues>;
  watch: UseFormWatch<ExpenseFormValues>;
  fields: FieldArrayWithId<ExpenseFormValues, "items", "id">[];
  isItemsCollapsed: boolean;
  toggleItemsCollapsed: () => void;
  onEditPhotosLoaded?: (photos: string[]) => void;
}

/**
 * Hook unificado para gerenciar todo o preenchimento automático do formulário de despesas.
 * Otimizado para React 19 usando useRef para controlar execuções únicas.
 */
export const useExpenseFormAutofill = ({
  expenseData,
  autofillData,
  isEdit,
  reset,
  setValue,
  watch,
  fields,
  isItemsCollapsed,
  toggleItemsCollapsed,
  onEditPhotosLoaded,
}: UseExpenseFormAutofillProps) => {
  const location = useLocation();

  // Flags para controlar execução única e evitar loops infinitos
  const hasFilledCoupon = useRef(false);
  const hasFilledDefaults = useRef(false);
  const hasFilledEdit = useRef(false);
  const lastFieldsLength = useRef(fields.length);

  // 1. Preenche dados de edição (prioridade máxima)
  useEffect(() => {
    if (expenseData && isEdit && !hasFilledEdit.current) {
      const valueIsString = typeof expenseData.value === "string";
      const value = valueIsString
        ? parseFloat(expenseData.value as string)
        : (expenseData.value as number);

      reset({
        name: expenseData.name,
        uri: expenseData.uri,
        value: value,
        payment: { name: expenseData.payment.name },
        store: { name: expenseData.store.name },
        date: formatDateToYYYYMMDD(expenseData.date),
        repeat: expenseData.repeat,
        items: expenseData.items.map((item) => ({
          ...item,
          value: formatCurrencyInputBRL(item.value.toString()),
          quantity: formatGramsDisplay(item.quantity),
          total:
            typeof item.total === "string"
              ? parseFloat(item.total)
              : item.total,
        })),
        recurrence:
          expenseData.recurrence ?? buildRecurrenceFromRecord(expenseData),
      });

      onEditPhotosLoaded?.(expenseData.photos ?? []);

      hasFilledEdit.current = true;
    }
  }, [expenseData, isEdit, reset, onEditPhotosLoaded]);

  // 2. Preenche dados do cupom fiscal (segunda prioridade)
  useEffect(() => {
    const couponData = location.state?.couponData as CouponData | undefined;

    if (couponData && !isEdit && !hasFilledCoupon.current) {
      reset({
        name: couponData.name,
        uri: couponData.uri || "",
        value: couponData.value,
        payment: { name: couponData.payment.name },
        store: { name: couponData.store.name },
        date: couponData.date,
        repeat: couponData.repeat || false,
        items: couponData.items.map((item) => ({
          code: item.code,
          name: item.name,
          quantity: formatGramsDisplay(item.quantity),
          value: formatCurrencyInputBRL(item.value.replace(",", "")),
          unit: item.unit,
          group: { name: item.group.name },
          total: item.total,
        })),
      });

      // Expande a seção de itens automaticamente
      if (!isItemsCollapsed) {
        toggleItemsCollapsed();
      }

      hasFilledCoupon.current = true;
    }
  }, [
    location.state?.couponData,
    isEdit,
    reset,
    isItemsCollapsed,
    toggleItemsCollapsed,
  ]);

  // 3. Define valores padrão (última prioridade)
  useEffect(() => {
    if (!isEdit && !hasFilledCoupon.current && autofillData) {
      const payments = autofillData.payments || [];
      const groups = autofillData.groups || [];

      // Define pagamento padrão (apenas uma vez)
      if (!hasFilledDefaults.current && payments.length > 0) {
        reset({
          payment: { name: payments[0].name },
        });
        hasFilledDefaults.current = true;
      }

      // Define grupo padrão para novos itens (quando a quantidade de itens muda)
      if (groups.length > 0 && fields.length !== lastFieldsLength.current) {
        fields.forEach((_, index) => {
          const currentGroupName = watch(`items.${index}.group.name`);
          if (!currentGroupName) {
            setValue(`items.${index}.group.name`, groups[0].name, {
              shouldValidate: true,
              shouldDirty: false,
            });
          }
        });
        lastFieldsLength.current = fields.length;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autofillData, isEdit, reset, setValue, watch, fields.length]);

  // Reset flags quando mudar contexto
  useEffect(() => {
    if (isEdit) {
      hasFilledCoupon.current = false;
      hasFilledDefaults.current = false;
    }
  }, [isEdit]);
};
