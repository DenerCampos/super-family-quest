import { useEffect, useRef, useState } from 'react';
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
import { FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import type { Revenue, PaginationResponse } from '../../services/resources';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateToBR } from '../../utils/formatDate';
import UserBadge from './UserBadge';

const ITEMS_PER_PAGE = 5;

interface RecurringRevenueResourceProps {
  onDelete: (id: string) => Promise<void>;
  onView?: (id: string) => void;
  refreshTrigger?: number;
  onTotalChange?: (total: number) => void;
}

const RecurringRevenueResource = ({
  onDelete,
  onView,
  refreshTrigger,
  onTotalChange,
}: RecurringRevenueResourceProps) => {
  const [revenues, setRevenues] = useState<PaginationResponse<Revenue>>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const loadRevenues = async (p: number = 1, s: string = '') => {
    setLoading(true);
    try {
      const data = await api.getRevenues({
        page: p,
        limit: ITEMS_PER_PAGE,
        search: s,
        isRecurring: true,
      });
      setRevenues(data);
      onTotalChange?.(data.meta.totalItems);
    } catch (error) {
      toast({
        title: t('recurring.revenue.error'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refreshTrigger) {
      loadRevenues(page, search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  useEffect(() => {
    loadRevenues(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

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

  const handleDelete = async (id: string) => {
    if (globalThis.confirm(t('recurring.revenue.deleteConfirm'))) {
      await onDelete(id);
    }
  };

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
          {t('recurring.revenue.title')}
        </Text>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color={getColor('text.resourceTable.searchIcon')} />
        </InputLeftElement>
        <Input
          placeholder={t('recurring.revenue.searchPlaceholder')}
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
          {t('recurring.revenue.noData')}
        </Text>
      ) : (
        <>
          <Box
            overflowX="auto"
            border="1px"
            borderColor={getColor('border.secondary')}
            borderRadius="md"
          >
            <Table variant="simple" minW="600px">
              <Thead>
                <Tr>
                  <Th>{t('resources.revenue.name')}</Th>
                  <Th>{t('resources.revenue.value')}</Th>
                  <Th>{t('resources.expense.date')}</Th>
                  <Th>{t('resources.revenue.actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {revenues?.data?.map((revenue) => (
                  <Tr key={revenue.id}>
                    <Td>
                      <Flex align="center" gap={2}>
                        {revenue.name}
                        {revenue.user &&
                          revenue.user.id !== profile?.user.id && (
                            <UserBadge user={revenue.user} />
                          )}
                      </Flex>
                    </Td>
                    <Td>
                      <Badge colorScheme={getColor('chakraColors.green')}>
                        + {formatCurrency(revenue.value)}
                      </Badge>
                    </Td>
                    <Td>{revenue.date ? formatDateToBR(revenue.date) : '-'}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          {t('resources.revenue.actions')}
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEye />}
                            onClick={() => onView?.(revenue.id ?? '')}
                          >
                            {t('resources.revenue.view')}
                          </MenuItem>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() =>
                              navigate(`/revenue/${revenue.id}`)
                            }
                          >
                            {t('resources.revenue.edit')}
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(revenue.id ?? '')}
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

export default RecurringRevenueResource;
