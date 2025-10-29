import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services";
import { GET_LAST_REGISTRATION_QUERY_KEY } from "./useGetLastRegistration";
import { useThemedTranslation } from "./useThemedTranslation";
import { REVENUE_QUERY_KEY } from "../pages/Revenue";
import { useNavigate } from "react-router-dom";

type RevenuePayload = {
  name: string;
  value: number;
  date: string;
  repeat: boolean;
};

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: (payload: RevenuePayload) => api.createRevenue(payload),
    onSuccess: () => {
      toast({
        title: t("common.created"),
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
      });
      
      const previousPath = -1;
      navigate(previousPath);
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("common.createError"),
        status: "error",
        duration: 3000,
      });
    },
  });
};

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useThemedTranslation();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RevenuePayload }) =>
      api.updateRevenue(id, payload),
    onSuccess: (_, variables) => {
      toast({
        title: t("common.updated"),
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [REVENUE_QUERY_KEY, variables.id],
      });

      const previousPath = -1;
      navigate(previousPath);
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("common.updateError"),
        status: "error",
        duration: 3000,
      });
    },
  });
};
