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
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FiEdit, FiEye, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import type { Expense, PaginationResponse } from '../../services/resources';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateToBR } from '../../utils/formatDate';
import UserBadge from './UserBadge';

const ITEMS_PER_PAGE = 5;

interface RecurringExpenseResourceProps {
  onDelete: (id: string) => Promise<void>;
  onView?: (id: string) => void;
  refreshTrigger?: number;
  onTotalChange?: (total: number) => void;
}

const RecurringExpenseResource = ({
  onDelete,
  onView,
  refreshTrigger,
  onTotalChange,
}: RecurringExpenseResourceProps) => {
  const { getColor } = useVisualTheme();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<PaginationResponse<Expense>>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { t } = useThemedTranslation();

  const loadExpenses = async (p: number = 1, s: string = '') => {
    setLoading(true);
    try {
      const data = await api.getExpenses({
        page: p,
        limit: ITEMS_PER_PAGE,
        search: s,
        isRecurring: true,
      });
      setExpenses(data);
      onTotalChange?.(data.meta.totalItems);
    } catch (error) {
      toast({
        title: t('recurring.expense.error'),
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
      loadExpenses(page, search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  useEffect(() => {
    loadExpenses(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

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

  const handleDelete = async (id: string) => {
    if (globalThis.confirm(t('recurring.expense.deleteConfirm'))) {
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
          {t('recurring.expense.title')}
        </Text>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color={getColor('text.resourceTable.searchIcon')} />
        </InputLeftElement>
        <Input
          placeholder={t('recurring.expense.searchPlaceholder')}
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color={getColor('text.accent')} />
        </Flex>
      ) : expenses?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          {t('recurring.expense.noData')}
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
                  <Th>{t('resources.expense.store')}</Th>
                  <Th>{t('resources.expense.value')}</Th>
                  <Th>{t('resources.expense.payment')}</Th>
                  <Th>{t('resources.expense.date')}</Th>
                  <Th>{t('resources.expense.actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {expenses?.data?.map((expense) => (
                  <Tr key={expense.id}>
                    <Td>
                      <Flex align="center" gap={2}>
                        {expense.name || '-'}
                        {expense.user &&
                          expense.user.id !== profile?.user.id && (
                            <UserBadge user={expense.user} />
                          )}
                      </Flex>
                    </Td>
                    <Td>
                      <Badge colorScheme={getColor('chakraColors.red')}>
                        - {formatCurrency(expense.value)}
                      </Badge>
                    </Td>
                    <Td>{expense.payment?.name || '-'}</Td>
                    <Td>{formatDateToBR(expense.date)}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          {t('resources.expense.actions')}
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEye />}
                            onClick={() => onView?.(expense.id ?? '')}
                          >
                            {t('resources.expense.view')}
                          </MenuItem>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() =>
                              navigate(`/expense/${expense.id}`)
                            }
                          >
                            {t('resources.expense.edit')}
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(expense.id ?? '')}
                            color={getColor('chakraColors.red')}
                          >
                            {t('resources.expense.delete')}
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
                  {t('resources.expense.previous')}
                </Button>
                <Button size="sm" variant="outline">
                  {page} / {expenses.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === expenses.meta.totalPages}
                >
                  {t('resources.expense.next')}
                </Button>
              </Stack>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default RecurringExpenseResource;
