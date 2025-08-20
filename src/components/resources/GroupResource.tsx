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
import type { Groups, PaginationResponse } from '../../services/resources';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
const ITEMS_PER_PAGE = 5;

interface GroupResourceProps {
  onEdit: (group: Groups | null) => void;
  onDelete: (id: string) => void;
  refreshTrigger?: number; // Prop para forçar atualização
}

const GroupResource = ({
  onEdit,
  onDelete,
  refreshTrigger,
}: GroupResourceProps) => {
  const [groups, setGroups] = useState<PaginationResponse<Groups>>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  const loadGroups = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const groupsData = await api.getGroups({
        page,
        limit: ITEMS_PER_PAGE,
        search,
      });
      setGroups(groupsData);
    } catch (error) {
      toast({
        title: t('resources.group.error'),
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
    loadGroups(page, search);
  };

  // Expor a função refreshData para o componente pai
  useEffect(() => {
    if (refreshTrigger) {
      refreshData();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    loadGroups(page, search);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce da busca para evitar muitas requisições
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadGroups(1, value);
      setPage(1);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNewGroup = () => {;
    onEdit(null);
  };

  const handleEdit = (group: Groups) => {
    onEdit(group);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('resources.group.deleteConfirm'))) {
      try {
        await onDelete(id);
        // Recarregar dados após exclusão
        loadGroups(page, search);
        toast({
          title: t('resources.group.deleteSuccess'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: t('resources.group.deleteError'),
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
          {t('resources.group.title')}
        </Text>
        <Button
          size="sm"
          bg={getColor('background.secondary')}
          color={getColor('text.primary')}
          _hover={{ bg: getColor('background.secondary') }}
          _focus={{ bg: getColor('background.secondary') }}
          leftIcon={<FiPlus />}
          onClick={handleNewGroup}
        >
          {t('resources.group.new')}
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color={getColor('gray.300')} />
        </InputLeftElement>
        <Input
          placeholder={t('resources.group.searchPlaceholder')}
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner color={getColor('text.accent')} />
        </Flex>
      ) : groups?.data?.length === 0 ? (
        <Text textAlign="center" py={4}>
          {t('resources.group.noData')}
        </Text>
      ) : (
        <>
          <Box
            overflowX="auto"
            border="1px"
            borderColor={getColor('gray.200')}
            borderRadius="md"
          >
            <Table variant="simple" minW="400px">
              <Thead>
                <Tr>
                  <Th>{t('resources.group.name')}</Th>
                  <Th>{t('resources.group.actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {groups?.data?.map((group) => (
                  <Tr key={group.id}>
                    <Td>{group.name}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} size="sm" variant="outline">
                          {t('resources.group.actions')}
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(group)}
                          >
                            {t('resources.group.edit')}
                          </MenuItem>
                          <MenuItem
                            icon={<FiTrash2 />}
                            onClick={() => handleDelete(group.id as string)}
                            color={getColor('chakraColors.red')}
                          >
                            {t('resources.group.delete')}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {groups?.meta && groups.meta.totalPages > 1 && (
            <Flex justify="flex-end" mt={4}>
              <Stack direction="row" spacing={2}>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  isDisabled={page === 1}
                >
                  {t('resources.group.previous')}
                </Button>
                <Button size="sm" variant="outline">
                  {page} / {groups.meta.totalPages}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === groups.meta.totalPages}
                >
                  {t('resources.group.next')}
                </Button>
              </Stack>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default GroupResource;
