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
import type { Merchant, PaginationResponse } from '../../services/resources';

const ITEMS_PER_PAGE = 5;

interface StoreResourceProps {
  onEdit: (store: Merchant | null) => void;
  onDelete: (id: string) => void;
  refreshTrigger?: number; // Prop para forçar atualização
}

const StoreResource = ({
  onEdit,
  onDelete,
  refreshTrigger,
}: StoreResourceProps) => {
  const [stores, setStores] = useState<PaginationResponse<Merchant>>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadStores = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const storesData = await api.getStores({
        page,
        limit: ITEMS_PER_PAGE,
        search,
      });
      setStores(storesData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar lojas',
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
    loadStores(page, search);
  };

  // Atualizar quando o refreshTrigger mudar
  useEffect(() => {
    if (refreshTrigger) {
      refreshData();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    loadStores(page, search);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce para evitar múltiplas requisições
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadStores(1, value);
      setPage(1);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNewStore = () => {
    onEdit(null);
  };

  const handleEdit = (store: Merchant) => {
    onEdit(store);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadStores(page, search);
        toast({
          title: 'Loja excluída com sucesso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro ao excluir loja',
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
          Lojas
        </Text>
        <Button
          size="sm"
          colorScheme="purple"
          leftIcon={<FiPlus />}
          onClick={handleNewStore}
        >
          Nova Loja
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Buscar lojas..."
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color="purple.500" />
        </Flex>
      ) : stores?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          Nenhuma loja encontrada
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
                {stores?.data?.map((store) => (
                  <Tr key={store.id}>
                    <Td>{store.name}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          Ações
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(store)}
                          >
                            Editar
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(store.id as string)}
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

          {stores?.meta && stores.meta.totalPages > 1 && (
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
                  {page} / {stores.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === stores.meta.totalPages}
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

export default StoreResource;
