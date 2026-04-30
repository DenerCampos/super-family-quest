import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services";
import { GET_LAST_REGISTRATION_QUERY_KEY } from "./useGetLastRegistration";
import { useThemedTranslation } from "./useThemedTranslation";
import { REVENUE_QUERY_KEY } from "../pages/Revenue";
import { useNavigate } from "react-router-dom";
import { useCoinFlight } from "../contexts/CoinFlightContext";
import type { Revenue } from "../services/resources";
import { coinDeltaFromApi, runAfterNextPaint } from "../utils/coinsNumber";

const DEFAULT_COINS_ON_CREATE_REVENUE = 10;

type RevenuePayload = {
  name: string;
  value: number;
  date: string;
  repeat: boolean;
};

export const useCreateRevenue = (redirectPath?: string | number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { playReward } = useCoinFlight();

  return useMutation({
    mutationFn: (payload: RevenuePayload) => api.createRevenue(payload),
    onSuccess: (data: Revenue) => {
      toast({
        title: t("common.created"),
        status: "success",
        duration: 3000,
      });
      const earned = coinDeltaFromApi(
        data.coins,
        DEFAULT_COINS_ON_CREATE_REVENUE,
      );
      queryClient.invalidateQueries({
        queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
      });

      if (redirectPath !== undefined) {
        navigate(redirectPath as string);
      } else {
        navigate(-1);
      }

      if (earned > 0) {
        runAfterNextPaint(() => playReward({ delta: earned }));
      }
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

export const useUpdateRevenue = (redirectPath?: string | number) => {
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
        description: t("common.updateError"),
        status: "error",
        duration: 3000,
      });
    },
  });
};
