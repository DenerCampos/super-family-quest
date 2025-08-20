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
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
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
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
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
        title: t('resources.revenue.error'),
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
    if (window.confirm(t('resources.revenue.deleteConfirm'))) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadRevenues(page, search);
        toast({
          title: t('resources.revenue.deleteSuccess'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: t('resources.revenue.deleteError'),
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
          {t('resources.revenue.title')}
        </Text>
        <Button
          size="sm"
          bg={getColor('background.secondary')}
          color={getColor('text.primary')}
          _hover={{ bg: getColor('background.secondary') }}
          _focus={{ bg: getColor('background.secondary') }}
          leftIcon={<FiPlus />}
          onClick={handleNewRevenue}
        >
          {t('resources.revenue.new')}
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color={getColor('gray.300')} />
        </InputLeftElement>
        <Input
          placeholder={t('resources.revenue.searchPlaceholder')}
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color={getColor('text.accent')} />
        </Flex>
      ) : revenues?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          {t('resources.revenue.noData')}
        </Text>
      ) : (
        <>
          <Box
            overflowX="auto"
            border="1px"
            borderColor={getColor('gray.500')}
            borderRadius="md"
          >
            <Table variant="simple" minW="600px">
              <Thead>
                <Tr>
                  <Th>{t('resources.revenue.name')}</Th>
                  <Th>{t('resources.revenue.value')}</Th>
                  <Th>{t('resources.revenue.repeat')}</Th>
                  <Th>{t('resources.revenue.actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {revenues?.data?.map((revenue) => (
                  <Tr key={revenue.id}>
                    <Td>{revenue.name}</Td>
                    <Td>
                      <Badge colorScheme={getColor('chakraColors.green')}>
                        + {formatCurrency(revenue.value)}
                      </Badge>
                    </Td>
                    <Td>
                      <Checkbox isChecked={revenue.repeat} isDisabled />
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          {t('resources.revenue.actions')}
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(revenue)}
                          >
                            {t('resources.revenue.edit')}
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(revenue.id as string)}
                            color={getColor('chakraColors.red')}
                          >
                            {t('resources.revenue.delete')}
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
                  {t('resources.revenue.previous')}
                </Button>
                <Button size="sm" variant="outline">
                  {page} / {revenues.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === revenues.meta.totalPages}
                >
                  {t('resources.revenue.next')}
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
