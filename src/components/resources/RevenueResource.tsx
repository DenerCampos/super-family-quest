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
  Checkbox,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { api } from '../../services';
import type { Revenue, PaginationResponse } from '../../services/resources';
import { formatCurrency } from '../../utils/formatCurrency';

const ITEMS_PER_PAGE = 5;

interface RevenueResourceProps {
  onEdit: (revenue: Revenue | null) => void;
  onDelete: (id: string) => void;
  refreshTrigger?: number;
}

const RevenueResource = ({
  onEdit,
  onDelete,
  refreshTrigger,
}: RevenueResourceProps) => {
  const [revenues, setRevenues] = useState<PaginationResponse<Revenue>>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadRevenues = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const revenuesData = await api.getRevenues({
        page,
        limit: ITEMS_PER_PAGE,
        search,
      });
      setRevenues(revenuesData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar receitas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Função pública para recarregar dados
  const refreshData = () => {
    loadRevenues(page, search);
  };

  // Expor a função refreshData para o componente pai
  useEffect(() => {
    if (refreshTrigger) {
      refreshData();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    loadRevenues(page, search);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce da busca para evitar muitas requisições
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadRevenues(1, value);
      setPage(1);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNewRevenue = () => {
    onEdit(null);
  };

  const handleEdit = (revenue: Revenue) => {
    onEdit(revenue);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadRevenues(page, search);
        toast({
          title: 'Receita excluída com sucesso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro ao excluir receita',
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
          Receitas
        </Text>
        <Button
          size="sm"
          colorScheme="green"
          leftIcon={<FiPlus />}
          onClick={handleNewRevenue}
        >
          Nova Receita
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Buscar receitas..."
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color="green.500" />
        </Flex>
      ) : revenues?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          Nenhuma receita encontrada
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
                  <Th>Nome</Th>
                  <Th>Valor</Th>
                  <Th>Repete?</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {revenues?.data?.map((revenue) => (
                  <Tr key={revenue.id}>
                    <Td>{revenue.name}</Td>
                    <Td>
                      <Badge colorScheme="green">
                        + {formatCurrency(revenue.value)}
                      </Badge>
                    </Td>
                    <Td>
                      <Checkbox isChecked={revenue.repeat} isDisabled />
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          Ações
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(revenue)}
                          >
                            Editar
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(revenue.id as string)}
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

          {revenues?.meta && revenues.meta.totalPages > 1 && (
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
                  {page} / {revenues.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === revenues.meta.totalPages}
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

export default RevenueResource;
