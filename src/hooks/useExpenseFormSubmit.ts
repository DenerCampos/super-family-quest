import type { UseFormReset } from "react-hook-form";
import { useLocation } from "react-router-dom";
import type { Expense } from "../services/resources";
import { parseBRLCurrency } from "../utils/formatCurrency";
import { parseGrams } from "../utils/formatGrams";
import { useCreateExpense, useUpdateExpense } from "./useExpensesMutations";

interface UseExpenseFormSubmitProps {
  isEdit: boolean;
  id?: string;
  removedItemIds: string[];
  reset: UseFormReset<Expense>;
}

export const useExpenseFormSubmit = ({
  isEdit,
  id,
  removedItemIds,
  reset,
}: UseExpenseFormSubmitProps) => {
  const location = useLocation();

  // Define o caminho de redirecionamento baseado na origem dos dados
  const redirectPath = location.state?.couponData ? "/" : undefined;

  const { mutateAsync: createExpense } = useCreateExpense(redirectPath);
  const { mutateAsync: updateExpense } = useUpdateExpense(redirectPath);

  const onSubmit = async (data: Expense) => {
    const formattedData = {
      ...data,
      name: data.store.name.trim(),
      value: data.items.reduce(
        (sum, item) =>
          sum +
          Number(parseBRLCurrency(item.value).toFixed(2)) *
            Number(parseGrams(item.quantity)),
        0
      ),
      items: data.items.map((item) => ({
        ...item,
        value: Number(parseBRLCurrency(item.value).toFixed(2)),
        quantity: Number(parseGrams(item.quantity)),
        total: (item.total =
          Number(parseBRLCurrency(item.value).toFixed(2)) *
          Number(parseGrams(item.quantity))),
      })),
      uri: "",
    };

    if (isEdit && id) {
      await updateExpense({
        id,
        data: {
          ...formattedData,
          id,
          items: formattedData.items.map((item) => ({
            ...item,
            id: item.id || "",
          })),
          removedItemIds,
        },
      });
    } else {
      await createExpense(formattedData);
    }

    reset();
  };

  return { onSubmit };
};
