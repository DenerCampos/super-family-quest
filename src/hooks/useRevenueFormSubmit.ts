import { useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import type { UseFormReset } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import type { RevenueFormData } from "../components/RevenueForm";
import { REVENUE_QUERY_KEY } from "../pages/Revenue";
import { api } from "../services";
import { buildRevenueCreatePayload } from "../utils/financialFormMapper";
import { useCreateRevenue, useUpdateRevenue } from "./useRevenueMutations";
import { useThemedTranslation } from "./useThemedTranslation";
import { GET_LAST_REGISTRATION_QUERY_KEY } from "./useGetLastRegistration";

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
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useThemedTranslation();
  const redirectPath = location.state?.couponData ? "/" : undefined;
  const { mutateAsync: createRevenue } = useCreateRevenue(redirectPath);
  const { mutateAsync: updateRevenue } = useUpdateRevenue(redirectPath);

  const finishPhotoOnlyEdit = async (revenueId: string) => {
    toast({
      title: t("common.updated"),
      status: "success",
      duration: 3000,
    });
    await queryClient.invalidateQueries({
      queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
    });
    await queryClient.invalidateQueries({
      queryKey: [REVENUE_QUERY_KEY, revenueId],
    });
    if (redirectPath !== undefined) {
      navigate(redirectPath);
    } else {
      navigate(-1);
    }
  };

  const onSubmit = async (
    data: RevenueFormData,
    pendingPhotos: File[] = [],
    removedPhotoUrls: string[] = [],
    formDirty = false,
  ) => {
    const payload = buildRevenueCreatePayload(data);
    const hasPhotoEdits =
      pendingPhotos.length > 0 || removedPhotoUrls.length > 0;

    if (isEdit && id) {
      if (hasPhotoEdits) {
        let photoError = false;
        for (const url of removedPhotoUrls) {
          try {
            await api.deleteRevenuePhoto(id, url);
          } catch {
            photoError = true;
          }
        }
        for (const file of pendingPhotos) {
          try {
            await api.uploadRevenuePhoto(id, file);
          } catch {
            photoError = true;
          }
        }
        if (photoError) {
          toast({
            title: t("common.error"),
            description: t("financialSteps.photos.uploadPartialError"),
            status: "warning",
            duration: 4000,
          });
        }
      }

      if (formDirty) {
        await updateRevenue({ id, payload });
      } else if (hasPhotoEdits) {
        await finishPhotoOnlyEdit(id);
      }
    } else {
      const created = await createRevenue(payload);
      if (created?.id && pendingPhotos.length) {
        let photoError = false;
        for (const file of pendingPhotos) {
          try {
            await api.uploadRevenuePhoto(created.id, file);
          } catch {
            photoError = true;
          }
        }
        if (photoError) {
          toast({
            title: t("common.error"),
            description: t("financialSteps.photos.uploadPartialError"),
            status: "warning",
            duration: 4000,
          });
        }
      }
    }

    reset();
  };

  return { onSubmit };
};
