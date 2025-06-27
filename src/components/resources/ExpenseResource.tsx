import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Spinner,
  useToast,
  Badge,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { api } from '../../services';
import type { Expense, PaginationResponse } from '../../services/resources';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateToBR } from '../../utils/formatDate';

const ITEMS_PER_PAGE = 5;

interface ExpenseResourceProps {
  onEdit: (expense: Expense | null) => void;
  onDelete: (id: string) => void;
  refreshTrigger?: number;
}

const ExpenseResource = ({
  onEdit,
  onDelete,
  refreshTrigger,
}: ExpenseResourceProps) => {
  const [expenses, setExpenses] = useState<PaginationResponse<Expense>>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadExpenses = async (page: number = 1, search: string = '') => {
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
        title: 'Erro ao carregar despesas',
        status: 'error',
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
    onEdit(null);
  };

  const handleEdit = (expense: Expense) => {
    onEdit(expense);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadExpenses(page, search);
        toast({
          title: 'Despesa excluída com sucesso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro ao excluir despesa',
          status: 'error',
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
          Despesas
        </Text>
        <Button
          size="sm"
          colorScheme="red"
          leftIcon={<FiPlus />}
          onClick={handleNewExpense}
        >
          Nova Despesa
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Buscar despesas..."
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color="red.500" />
        </Flex>
      ) : expenses?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          Nenhuma despesa encontrada
        </Text>
      ) : (
        <>
          <Box
            overflowX="auto"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
          >
            <Table variant="simple" minW="600px">
              <Thead>
                <Tr>
                  <Th>Loja</Th>
                  <Th>Valor</Th>
                  <Th>Pagamento</Th>
                  <Th>Data</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {expenses?.data?.map((expense) => (
                  <Tr key={expense.id}>
                    <Td>{expense.name || '-'}</Td>
                    <Td>
                      <Badge colorScheme="red">
                        - {formatCurrency(expense.value)}
                      </Badge>
                    </Td>
                    <Td>{expense.payment?.name || '-'}</Td>
                    <Td>{formatDateToBR(expense.date)}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          Ações
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(expense)}
                          >
                            Editar
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(expense.id as string)}
                            color="red.500"
                          >
                            Excluir
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
                  Anterior
                </Button>
                <Button size="sm" variant="outline">
                  {page} / {expenses.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === expenses.meta.totalPages}
                >
                  Próxima
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
