import {
  Accordion,
  Box,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "../../components/Header";
import { NavigationBar } from "../../components/NavigationBar";
import { SimpleResourceModal } from "../../components/modals/SimpleResourceModal";
import ExpenseResource from "../../components/resources/ExpenseResource";
import GroupResource from "../../components/resources/GroupResource";
import PaymentResource from "../../components/resources/PaymentResource";
import ResourceContainer from "../../components/resources/ResourceContainer";
import RevenueResource from "../../components/resources/RevenueResource";
import StoreResource from "../../components/resources/StoreResource";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";
import { api } from "../../services";
import type {
  Expense,
  Groups,
  Merchant,
  Payments,
  Revenue,
} from "../../services/resources";

const NewResources = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  const [editingResource, setEditingResource] = useState<{
    type: "store" | "payment" | "group" | "expense" | "revenue";
    data: any;
  } | null>(null);

  // Controles de trigger para atualização dos componentes
  const [refreshTriggers, setRefreshTriggers] = useState({
    store: 0,
    payment: 0,
    group: 0,
    expense: 0,
    revenue: 0,
  });

  const {
    isOpen: isSimpleOpen,
    onOpen: onSimpleOpen,
    onClose: onSimpleClose,
  } = useDisclosure();

  const [currentResource, setCurrentResource] = useState<
    "store" | "payment" | "group"
  >("store");
  const toast = useToast();

  // Função para atualizar o trigger de refresh de um recurso específico
  const triggerRefresh = (
    resourceType: "store" | "payment" | "group" | "expense" | "revenue"
  ) => {
    setRefreshTriggers((prev) => ({
      ...prev,
      [resourceType]: prev[resourceType] + 1,
    }));
  };

  const handleResourceOpen = (
    resource: "store" | "payment" | "group" | "expense" | "revenue",
    itemToEdit?: Merchant | Payments | Groups | Expense | Revenue | null
  ) => {
    // Fechar todos os modais primeiro
    onSimpleClose();

    // Configurar dados de edição se existirem
    if (itemToEdit && Object.keys(itemToEdit).length > 0) {
      setEditingResource({ type: resource, data: itemToEdit });
    } else {
      setEditingResource(null); // Novo item
    }

    // Abrir o modal apropriado
    setCurrentResource(resource);
    onSimpleOpen();
  };

  const handleDelete = async (
    type: "store" | "payment" | "group" | "expense" | "revenue",
    id: string
  ) => {
    try {
      // Implementar chamadas específicas para cada tipo
      switch (type) {
        case "store":
          await api.deleteStore({ id });
          break;
        case "payment":
          await api.deletePayment({ id });
          break;
        case "group":
          await api.deleteGroup({ id });
          break;
        case "expense":
          await api.deleteExpense({ id });
          break;
        case "revenue":
          await api.deleteRevenue({ id });
          break;
      }

      // Atualizar a listagem do recurso específico
      triggerRefresh(type);

      toast({
        title: t("resources.deleteSuccess"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("resources.deleteError"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  // Função chamada quando um modal é fechado com sucesso
  const handleModalSuccess = (
    resourceType: "store" | "payment" | "group" | "expense" | "revenue"
  ) => {
    setEditingResource(null);
    triggerRefresh(resourceType);
  };

  return (
    <Flex direction="column" minH="100vh" bg={getColor("background.resources")}>
      <Header />

      <Box p={4} mb="70px">
        <Accordion allowMultiple>
          {/* Seção Cadastros */}
          <ResourceContainer
            title="Cadastros"
            colorScheme={getColor("primary")}
          >
            <StoreResource
              onEdit={(store) => handleResourceOpen("store", store)}
              onDelete={(id) => handleDelete("store", id)}
              refreshTrigger={refreshTriggers.store}
            />

            <PaymentResource
              onEdit={(payment) => handleResourceOpen("payment", payment)}
              onDelete={(id) => handleDelete("payment", id)}
              refreshTrigger={refreshTriggers.payment}
            />

            <GroupResource
              onEdit={(group) => handleResourceOpen("group", group)}
              onDelete={(id) => handleDelete("group", id)}
              refreshTrigger={refreshTriggers.group}
            />
          </ResourceContainer>

          {/* Seção Despesas */}
          <ResourceContainer title="Despesas" colorScheme={getColor("expense")}>
            <ExpenseResource
              onDelete={(id) => handleDelete("expense", id)}
              refreshTrigger={refreshTriggers.expense}
            />
          </ResourceContainer>

          {/* Seção Receitas */}
          <ResourceContainer title="Receitas" colorScheme={getColor("revenue")}>
            <RevenueResource
              onDelete={(id) => handleDelete("revenue", id)}
              refreshTrigger={refreshTriggers.revenue}
            />
          </ResourceContainer>
        </Accordion>
      </Box>

      {/* Modal para recursos simples (store, payment, group) */}
      {isSimpleOpen && !!currentResource && (
        <SimpleResourceModal
          isOpen={isSimpleOpen}
          onClose={() => {
            onSimpleClose();
            setEditingResource(null);
          }}
          resourceType={currentResource}
          onSuccess={() => handleModalSuccess(currentResource)}
          initialData={
            editingResource?.type === currentResource
              ? editingResource.data
              : null
          }
        />
      )}

      <NavigationBar />
    </Flex>
  );
};

export default NewResources;
