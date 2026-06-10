import { useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import type { UseFormReset } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services";
import type { Expense } from "../services/resources";
import type { RecurrenceForm } from "../types/financial";
import { buildExpenseCreatePayload } from "../utils/financialFormMapper";
import { useCreateExpense, useUpdateExpense } from "./useExpensesMutations";
import { useThemedTranslation } from "./useThemedTranslation";
import { GET_LAST_REGISTRATION_QUERY_KEY } from "./useGetLastRegistration";

export type ExpenseFormValues = Expense & {
  recurrence?: RecurrenceForm;
};

interface UseExpenseFormSubmitProps {
  isEdit: boolean;
  id?: string;
  removedItemIds: string[];
  reset: UseFormReset<ExpenseFormValues>;
  pendingPhotos?: File[];
  removedPhotoUrls?: string[];
  formDirty?: boolean;
  onPhotosUploaded?: () => void;
}

export const useExpenseFormSubmit = ({
  isEdit,
  id,
  removedItemIds,
  reset,
  pendingPhotos = [],
  removedPhotoUrls = [],
  formDirty = false,
  onPhotosUploaded,
}: UseExpenseFormSubmitProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useThemedTranslation();
  const redirectPath = location.state?.couponData ? "/" : undefined;
  const { mutateAsync: createExpense } = useCreateExpense(redirectPath);
  const { mutateAsync: updateExpense } = useUpdateExpense(redirectPath);

  const finishPhotoOnlyEdit = async (expenseId: string) => {
    toast({
      title: t("common.success"),
      status: "success",
      duration: 3000,
    });
    await queryClient.invalidateQueries({
      queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
    });
    await queryClient.invalidateQueries({
      queryKey: ["expense", expenseId],
    });
    if (redirectPath !== undefined) {
      navigate(redirectPath);
    } else {
      navigate(-1);
    }
  };

  const onSubmit = async (data: ExpenseFormValues) => {
    const apiPayload = buildExpenseCreatePayload(data);
    const hasPhotoEdits =
      pendingPhotos.length > 0 || removedPhotoUrls.length > 0;

    if (isEdit && id) {
      if (hasPhotoEdits) {
        let photoError = false;
        for (const url of removedPhotoUrls) {
          try {
            await api.deleteExpensePhoto(id, url);
          } catch {
            photoError = true;
          }
        }
        for (const file of pendingPhotos) {
          try {
            await api.uploadExpensePhoto(id, file);
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
        onPhotosUploaded?.();
      }

      if (formDirty) {
        await updateExpense({
          id,
          data: {
            ...apiPayload,
            id,
            items: apiPayload.items.map((item, index) => ({
              ...item,
              id: data.items[index]?.id || "",
            })),
            removedItemIds,
          },
        });
      } else if (hasPhotoEdits) {
        await finishPhotoOnlyEdit(id);
      }
    } else {
      const created = await createExpense(apiPayload);
      if (created?.id && pendingPhotos.length) {
        let photoError = false;
        for (const file of pendingPhotos) {
          try {
            await api.uploadExpensePhoto(created.id, file);
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
        onPhotosUploaded?.();
      }
    }

    reset();
  };

  return { onSubmit };
};
