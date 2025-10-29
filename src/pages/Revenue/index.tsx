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
import { AvenueForm, type RevenueFormData } from "../../components/AvenueForm";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { AvenueSkeleton } from "../../components/skeletons/Avenue.skeleton";
import {
  useCreateRevenue,
  useUpdateRevenue,
} from "../../hooks/useRevenueMutations";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";
import { api } from "../../services";
import {
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from "../../utils/formatCurrency";

export const REVENUE_QUERY_KEY = "revenue";
const Revenue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  const { data, isLoading } = useQuery({
    queryKey: [REVENUE_QUERY_KEY, id],
    queryFn: () => api.getRevenueById(id!),
    enabled: !!id,
  });
  const createRevenue = useCreateRevenue();
  const updateRevenue = useUpdateRevenue();

  const isEdit = !!id;

  const form = useForm({
    defaultValues: {
      name: "",
      value: "",
      repeat: false,
      date: new Date().toISOString().split("T")[0],
    },
  });
  const reset = form.reset;

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        value: formatCurrencyInputBRL(data.value.toString()),
        repeat: data.repeat,
        date: data.date.split("T")[0],
      });
    }
  }, [data, reset]);

  if (isLoading) {
    return <AvenueSkeleton />;
  }

  const onSubmit = async (data: RevenueFormData) => {
    const payload = {
      name: data.name,
      value: parseBRLCurrency(data.value),
      date: data.date,
      repeat: data.repeat,
    };

    if (!isEdit) {
      await createRevenue.mutateAsync(payload);
    }

    if (isEdit) {
      await updateRevenue.mutateAsync({
        id,
        payload,
      });
    }

    reset();
  };

  if (createRevenue.isPending || updateRevenue.isPending) {
    return <LoadingOverlay text="Salvando" />;
  }

  return (
    <Flex direction="column" minH="100vh" bg={getColor("background.primary")}>
      <Flex direction="column" flex="1" p={4} pb={0}>
        <Flex
          direction="row"
          gap={4}
          justify="flex-start"
          align="center"
          mb={6}
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
              if (form.formState.isDirty) {
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

        <FormProvider {...form}>
          <AvenueForm onSubmit={onSubmit} isEdit={isEdit} id={id} />
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
                {t("common.close")}
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
