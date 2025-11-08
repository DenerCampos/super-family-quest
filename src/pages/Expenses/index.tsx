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
};

export const Expenses = () => {
  const { id } = useParams<{ id: string }>();
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const form = useForm<Expense>({
    mode: "onChange",
    defaultValues: defaultExpense,
  });

  const isEdit = !!id;

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
        <FormProvider {...form}>
          <ExpensesForm isEdit={isEdit} id={id} />
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
