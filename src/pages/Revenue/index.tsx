import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { RevenueForm, type RevenueFormData } from "../../components/RevenueForm";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { RevenueSkeleton } from "../../components/skeletons/Revenue.skeleton";
import { useRevenueFormSubmit } from "../../hooks/useRevenueFormSubmit";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";
import { api } from "../../services";
import type { RecurrenceForm } from "../../types/financial";
import { formatDateToYYYYMMDD } from "../../utils/formatDate";
import { formatCurrencyInputBRL } from "../../utils/formatCurrency";
import { buildRecurrenceFromRecord } from "../../utils/financialFormMapper";

const defaultRecurrence: RecurrenceForm = {
  enabled: false,
  mode: 'none',
  count: 2,
  intervalUnit: 'months',
  intervalValue: 1,
  dueDay: 10,
};

export const REVENUE_QUERY_KEY = "revenue";
const Revenue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPhotoChanges, setHasPhotoChanges] = useState(false);
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  const isEdit = !!id;

  const form = useForm<RevenueFormData>({
    defaultValues: {
      name: "",
      value: "",
      repeat: false,
      date: new Date().toISOString().split("T")[0],
      recurrence: defaultRecurrence,
    },
  });
  const reset = form.reset;

  const { data, isLoading } = useQuery({
    queryKey: [REVENUE_QUERY_KEY, id],
    queryFn: () => api.getRevenueById(id!),
    enabled: !!id,
  });

  const { onSubmit } = useRevenueFormSubmit({
    isEdit,
    id,
    reset,
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        value: formatCurrencyInputBRL(data.value.toString()),
        repeat: data.repeat,
        date: formatDateToYYYYMMDD(data.date),
        recurrence: data.recurrence ?? buildRecurrenceFromRecord(data),
      });
    }
  }, [data, reset]);

  if (isLoading) {
    return <RevenueSkeleton />;
  }

  const handleSubmit = async (
    data: RevenueFormData,
    pendingPhotos: File[],
    removedPhotoUrls: string[],
    formDirty: boolean,
  ) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data, pendingPhotos, removedPhotoUrls, formDirty);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingOverlay text="Salvando" />;
  }

  return (
    <Flex direction="column" h="100vh" overflow="hidden" bg={getColor("background.primary")}>
      <Flex flexShrink={0} direction="column" px={4} pt={4} pb={2}>
        <Flex
          direction="row"
          gap={4}
          justify="flex-start"
          align="center"
          mb={4}
        >
          <IconButton
            icon={<FiArrowLeft />}
            size="md"
            aria-label="Voltar"
            borderRadius="full"
            color={getColor("text.primary")}
            bg={getColor("background.tertiary")}
            border="1px solid"
            borderColor={getColor("border.primary")}
            _hover={{
              bg: getColor("background.selected"),
              color: getColor("text.accent"),
            }}
            onClick={() => {
              if (form.formState.isDirty || hasPhotoChanges) {
                setIsConfirmModalOpen(true);
                return;
              }

              navigate(-1);
              reset();
            }}
          />
          <Text
            color={getColor("text.primary")}
            fontSize="2xl"
            fontWeight="medium"
          >
            {isEdit
              ? t("resources.revenue.editTitle")
              : t("resources.revenue.new")}
          </Text>
        </Flex>
      </Flex>
      <Flex flex="1" minH={0} direction="column" px={4} pb={4}>
        <FormProvider {...form}>
          <RevenueForm
            onSubmit={handleSubmit}
            isEdit={isEdit}
            id={id}
            onPhotoChangesChange={setHasPhotoChanges}
          />
        </FormProvider>
      </Flex>

      {isConfirmModalOpen && (
        <Modal
          size="xs"
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("modals.revenue.confirm")}</ModalHeader>
            <ModalBody>{t("modals.revenue.confirmDescription")}</ModalBody>
            <ModalFooter gap={4}>
              <Button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  reset();
                }}
              >
                {t("common.closeConfirm")}
              </Button>
              <Button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  navigate(-1);
                }}
              >
                {t("common.confirm")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default Revenue;
