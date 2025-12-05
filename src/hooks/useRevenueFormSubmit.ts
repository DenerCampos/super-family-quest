import type { UseFormReset } from "react-hook-form";
import { useLocation } from "react-router-dom";
import type { RevenueFormData } from "../components/RevenueForm";
import { parseBRLCurrency } from "../utils/formatCurrency";
import { useCreateRevenue, useUpdateRevenue } from "./useRevenueMutations";

interface UseRevenueFormSubmitProps {
  isEdit: boolean;
  id?: string;
  reset: UseFormReset<RevenueFormData>;
}

export const useRevenueFormSubmit = ({
  isEdit,
  id,
  reset,
}: UseRevenueFormSubmitProps) => {
  const location = useLocation();

  // Define o caminho de redirecionamento baseado na origem dos dados
  const redirectPath = location.state?.couponData ? "/" : undefined;

  const { mutateAsync: createRevenue } = useCreateRevenue(redirectPath);
  const { mutateAsync: updateRevenue } = useUpdateRevenue(redirectPath);

  const onSubmit = async (data: RevenueFormData) => {
    const payload = {
      name: data.name,
      value: parseBRLCurrency(data.value),
      date: data.date,
      repeat: data.repeat,
    };

    if (isEdit && id) {
      await updateRevenue({
        id,
        payload,
      });
    } else {
      await createRevenue(payload);
    }

    reset();
  };

  return { onSubmit };
};