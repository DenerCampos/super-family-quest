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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import ExpensesForm from "../../components/ExpensesForm";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";
import type { Expense } from "../../services/resources";

const defaultItem = {
  code: "1",
  name: "",
  quantity: "1",
  unit: "Unidade",
  value: "0,00",
  total: 0,
  group: {
    name: "",
  },
};

const defaultExpense = {
  name: "",
  uri: "",
  value: 0,
  repeat: false,
  date: new Date().toISOString().split("T")[0],
  store: {
    name: "",
  },
  payment: {
    name: "",
  },
  items: [defaultItem],
  recurrence: {
    enabled: false,
    mode: 'none' as const,
    count: 2,
    intervalUnit: 'months' as const,
    intervalValue: 1,
    dueDay: 10,
  },
};

export const Expenses = () => {
  const { id } = useParams<{ id: string }>();
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hasPhotoChanges, setHasPhotoChanges] = useState(false);

  const form = useForm<Expense>({
    mode: "onChange",
    defaultValues: defaultExpense,
  });

  const isEdit = !!id;

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
              color: getColor("text.financial.accent"),
            }}
            onClick={() => {
              if (form.formState.isDirty || hasPhotoChanges) {
                setIsConfirmModalOpen(true);
                return;
              }

              navigate(-1);
              form.reset();
            }}
          />
          <Text
            color={getColor("text.primary")}
            fontSize="2xl"
            fontWeight="medium"
          >
            {isEdit
              ? t("resources.expense.editTitle")
              : t("resources.expense.new")}
          </Text>
        </Flex>
      </Flex>
      <Flex flex="1" minH={0} direction="column" px={4} pb={4}>
        <FormProvider {...form}>
          <ExpensesForm
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
            <ModalHeader>{t("common.confirmTitle")}</ModalHeader>
            <ModalBody>{t("common.confirmDescription")}</ModalBody>
            <ModalFooter gap={4}>
              <Button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  form.reset();
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
