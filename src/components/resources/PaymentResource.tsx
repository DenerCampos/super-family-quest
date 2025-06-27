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
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { api } from '../../services';
import type { Payments, PaginationResponse } from '../../services/resources';

const ITEMS_PER_PAGE = 5;

interface PaymentResourceProps {
  onEdit: (payment: Payments | null) => void;
  onDelete: (id: string) => void;
  refreshTrigger?: number;
}

const PaymentResource = ({
  onEdit,
  onDelete,
  refreshTrigger,
}: PaymentResourceProps) => {
  const [payments, setPayments] = useState<PaginationResponse<Payments>>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadPayments = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const paymentsData = await api.getPayments({
        page,
        limit: ITEMS_PER_PAGE,
        search,
      });
      setPayments(paymentsData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar formas de pagamento',
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
    loadPayments(page, search);
  };

  // Expor a função refreshData para o componente pai
  useEffect(() => {
    if (refreshTrigger) {
      refreshData();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    loadPayments(page, search);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce da busca para evitar muitas requisições
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadPayments(1, value);
      setPage(1);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNewPayment = () => {
    onEdit(null);
  };

  const handleEdit = (payment: Payments) => {
    onEdit(payment);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm('Tem certeza que deseja excluir esta forma de pagamento?')
    ) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadPayments(page, search);
        toast({
          title: 'Forma de pagamento excluída com sucesso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro ao excluir forma de pagamento',
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
          Formas de Pagamento
        </Text>
        <Button
          size="sm"
          colorScheme="purple"
          leftIcon={<FiPlus />}
          onClick={handleNewPayment}
        >
          Nova Forma
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Buscar formas de pagamento..."
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color="purple.500" />
        </Flex>
      ) : payments?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          Nenhuma forma de pagamento encontrada
        </Text>
      ) : (
        <>
          <Box
            overflowX="auto"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
          >
            <Table variant="simple" minW="400px">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments?.data?.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>{payment.name}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          Ações
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(payment)}
                          >
                            Editar
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(payment.id as string)}
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

          {payments?.meta && payments.meta.totalPages > 1 && (
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
                  {page} / {payments.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === payments.meta.totalPages}
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

export default PaymentResource;
