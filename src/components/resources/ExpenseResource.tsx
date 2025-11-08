import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";
import { api } from "../../services";
import type { Expense, PaginationResponse } from "../../services/resources";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateToBR } from "../../utils/formatDate";

const ITEMS_PER_PAGE = 5;

interface ExpenseResourceProps {
  onDelete: (id: string) => void;
  refreshTrigger?: number;
}

const ExpenseResource = ({
  onDelete,
  refreshTrigger,
}: ExpenseResourceProps) => {
  const { getColor } = useVisualTheme();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<PaginationResponse<Expense>>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { t } = useThemedTranslation();
  const loadExpenses = async (page: number = 1, search: string = "") => {
    setLoading(true);
    try {
      const expensesData = await api.getExpenses({
        page,
        limit: ITEMS_PER_PAGE,
        search,
      });
      setExpenses(expensesData);
    } catch (error) {
      toast({
        title: t("resources.expense.error"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Função pública para recarregar dados (será chamada pelo componente pai)
  const refreshData = () => {
    loadExpenses(page, search);
  };

  // Expor a função refreshData para o componente pai
  useEffect(() => {
    if (refreshTrigger) {
      refreshData();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    loadExpenses(page, search);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce da busca para evitar muitas requisições
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadExpenses(1, value);
      setPage(1);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNewExpense = () => {
    navigate("/expense");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("resources.expense.deleteConfirm"))) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadExpenses(page, search);
        toast({
          title: t("resources.expense.deleteSuccess"),
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: t("resources.expense.deleteError"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box mb={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="medium">
          {t("resources.expense.title")}
        </Text>
        <Button
          size="sm"
          bg={getColor("button.background.neutral")}
          color={getColor("button.text.primary")}
          border="1px solid"
          borderColor={getColor("button.border.neutral")}
          _hover={{
            bg: getColor("button.hover.background.inverse"),
            color: getColor("button.hover.text.inverse"),
          }}
          _focus={{
            bg: getColor("button.hover.background.neutral"),
            color: getColor("button.hover.text.neutral"),
          }}
          leftIcon={<FiPlus />}
          onClick={handleNewExpense}
        >
          {t("resources.expense.new")}
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder={t("resources.expense.searchPlaceholder")}
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color={getColor("text.accent")} />
        </Flex>
      ) : expenses?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          {t("resources.expense.noData")}
        </Text>
      ) : (
        <>
          <Box
            overflowX="auto"
            border="1px"
            borderColor={getColor("gray.500")}
            borderRadius="md"
          >
            <Table variant="simple" minW="600px">
              <Thead>
                <Tr>
                  <Th>{t("resources.expense.store")}</Th>
                  <Th>{t("resources.expense.value")}</Th>
                  <Th>{t("resources.expense.payment")}</Th>
                  <Th>{t("resources.expense.date")}</Th>
                  <Th>{t("resources.expense.actions")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {expenses?.data?.map((expense) => (
                  <Tr key={expense.id}>
                    <Td>{expense.name || "-"}</Td>
                    <Td>
                      <Badge colorScheme={getColor("chakraColors.red")}>
                        - {formatCurrency(expense.value)}
                      </Badge>
                    </Td>
                    <Td>{expense.payment?.name || "-"}</Td>
                    <Td>{formatDateToBR(expense.date)}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          {t("resources.expense.actions")}
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => navigate(`/expense/${expense.id}`)}
                          >
                            {t("resources.expense.edit")}
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(expense.id as string)}
                            color={getColor("chakraColors.red")}
                          >
                            {t("resources.expense.delete")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {expenses?.meta && expenses.meta.totalPages > 1 && (
            <Flex justify="flex-end" mt={4}>
              <Stack direction="row" spacing={2}>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  isDisabled={page === 1}
                >
                  {t("resources.expense.previous")}
                </Button>
                <Button size="sm" variant="outline">
                  {page} / {expenses.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === expenses.meta.totalPages}
                >
                  {t("resources.expense.next")}
                </Button>
              </Stack>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default ExpenseResource;
