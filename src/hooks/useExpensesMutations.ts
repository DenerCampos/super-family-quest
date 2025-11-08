import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../services";
import type { CreateExpense, UpdateExpense } from "../services/resources";
import { GET_LAST_REGISTRATION_QUERY_KEY } from "./useGetLastRegistration";
import { useThemedTranslation } from "./useThemedTranslation";

interface UpdateExpensePayload {
  id: string;
  data: UpdateExpense;
}

export const useCreateExpense = (redirectPath?: string | number) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateExpense) => api.createExpense(data),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        status: "success",
        duration: 3000,
      });

      queryClient.invalidateQueries({
        queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
      });

      // Se redirectPath for fornecido, usa ele, senão volta para página anterior
      if (redirectPath !== undefined) {
        navigate(redirectPath as string);
      } else {
        navigate(-1);
      }
    },
    onError: () => {
      toast({
        title: t("common.error"),
        status: "error",
        duration: 3000,
      });
    },
  });
};

export const useUpdateExpense = (redirectPath?: string | number) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: UpdateExpensePayload) =>
      api.updateExpense(payload.id, payload.data),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        status: "success",
        duration: 3000,
      });

      queryClient.invalidateQueries({
        queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
      });

      // Se redirectPath for fornecido, usa ele, senão volta para página anterior
      if (redirectPath !== undefined) {
        navigate(redirectPath as string);
      } else {
        navigate(-1);
      }
    },
    onError: () => {
      toast({
        title: t("common.error"),
        status: "error",
        duration: 3000,
      });
    },
  });
};
