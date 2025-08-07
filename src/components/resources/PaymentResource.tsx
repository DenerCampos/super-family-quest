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
import { useThemeTranslation } from '../../hooks/useThemeTranslation';

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
  const { t } = useThemeTranslation();
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
        title: t('resources.payment.error'),
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
      window.confirm(t('resources.payment.deleteConfirm'))
    ) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadPayments(page, search);
        toast({
          title: t('resources.payment.deleteSuccess'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: t('resources.payment.deleteError'),
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
          {t('resources.payment.title')}
        </Text>
        <Button
          size="sm"
          colorScheme="purple"
          leftIcon={<FiPlus />}
          onClick={handleNewPayment}
        >
          {t('resources.payment.new')}
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder={t('resources.payment.searchPlaceholder')}
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
          {t('resources.payment.noData')}
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
                  <Th>{t('resources.payment.name')}</Th>
                  <Th>{t('resources.payment.actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments?.data?.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>{payment.name}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          {t('resources.payment.actions')}
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(payment)}
                          >
                            {t('resources.payment.edit')}
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(payment.id as string)}
                            color="red.500"
                          >
                            {t('resources.payment.delete')}
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
                  {t('resources.payment.previous')}
                </Button>
                <Button size="sm" variant="outline">
                  {page} / {payments.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === payments.meta.totalPages}
                >
                  {t('resources.payment.next')}
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
