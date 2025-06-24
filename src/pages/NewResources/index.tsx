import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
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
  useDisclosure,
  Badge,
  Text,
  Stack,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { SimpleResourceModal } from '../../components/modals/SimpleResourceModal';
import { CouponModal } from '../../components/modals/CouponModal';
import { api } from '../../services';
import type {
  Groups,
  Merchant,
  Payments,
  Expense,
  PaginationResponse,
} from '../../services/resources';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateToBR } from '../../utils/formatDate';

const ITEMS_PER_PAGE = 5;

const NewResources = () => {
  const [stores, setStores] = useState<PaginationResponse<Merchant>>();
  const [payments, setPayments] = useState<PaginationResponse<Payments>>();
  const [groups, setGroups] = useState<PaginationResponse<Groups>>();
  const [expenses, setExpenses] = useState<PaginationResponse<Expense>>();

  const [storeSearch, setStoreSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');

  const [storePage, setStorePage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [groupPage, setGroupPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);

  const [loading, setLoading] = useState({
    stores: true,
    payments: true,
    groups: true,
    expenses: true,
  });

  const {
    isOpen: isSimpleOpen,
    onOpen: onSimpleOpen,
    onClose: onSimpleClose,
  } = useDisclosure();
  const {
    isOpen: isCouponOpen,
    onOpen: onCouponOpen,
    onClose: onCouponClose,
  } = useDisclosure();
  const [currentResource, setCurrentResource] = useState<
    'store' | 'payment' | 'group'
  >('store');
  const [editingItem, setEditingItem] = useState<any>(null);
  const toast = useToast();

  // Função para carregar dados com paginação
  const loadStores = async (page: number = 1, search: string = '') => {
    setLoading((prev) => ({ ...prev, stores: true }));
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
      setLoading((prev) => ({ ...prev, stores: false }));
    }
  };

  const loadPayments = async (page: number = 1, search: string = '') => {
    setLoading((prev) => ({ ...prev, payments: true }));
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
      setLoading((prev) => ({ ...prev, payments: false }));
    }
  };

  const loadGroups = async (page: number = 1, search: string = '') => {
    setLoading((prev) => ({ ...prev, groups: true }));
    try {
      const groupsData = await api.getGroups({
        page,
        limit: ITEMS_PER_PAGE,
        search,
      });
      setGroups(groupsData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar grupos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, groups: false }));
    }
  };

  const loadExpenses = async (page: number = 1, search: string = '') => {
    setLoading((prev) => ({ ...prev, expenses: true }));
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
      setLoading((prev) => ({ ...prev, expenses: false }));
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadStores(storePage);
    loadPayments(paymentPage);
    loadGroups(groupPage);
    loadExpenses(expensePage);
  }, []);

  const handleResourceOpen = (
    resource: 'store' | 'payment' | 'group' | 'expense',
    itemToEdit?: any,
  ) => {
    setEditingItem(itemToEdit || null);
    if (resource === 'expense') {
      onCouponOpen();
    } else {
      setCurrentResource(resource);
      console.log(resource);
      console.log(editingItem);
      
      
      onSimpleOpen();
    }
  };

  const handleDelete = async (
    type: 'store' | 'payment' | 'group' | 'expense',
    id: number | string,
  ) => {
    try {
      // switch (type) {
      //   case 'store':
      //     await api.deleteStore(id);
      //     loadStores(storePage, storeSearch);
      //     break;
      //   case 'payment':
      //     await api.deletePayment(id);
      //     loadPayments(paymentPage, paymentSearch);
      //     break;
      //   case 'group':
      //     await api.deleteGroup(id);
      //     loadGroups(groupPage, groupSearch);
      //     break;
      //   case 'expense':
      //     await api.deleteCoupon(id);
      //     loadExpenses(expensePage, expenseSearch);
      //     break;
      // }

      toast({
        title: 'Item excluído com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  // Funções para manipulação de busca
  const handleStoreSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreSearch(e.target.value);
    loadStores(1, e.target.value);
    setStorePage(1);
  };

  const handlePaymentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentSearch(e.target.value);
    loadPayments(1, e.target.value);
    setPaymentPage(1);
  };

  const handleGroupSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSearch(e.target.value);
    loadGroups(1, e.target.value);
    setGroupPage(1);
  };

  const handleExpenseSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseSearch(e.target.value);
    loadExpenses(1, e.target.value);
    setExpensePage(1);
  };

  // Funções para mudança de página
  const handleStorePageChange = (page: number) => {
    setStorePage(page);
    loadStores(page, storeSearch);
  };

  const handlePaymentPageChange = (page: number) => {
    setPaymentPage(page);
    loadPayments(page, paymentSearch);
  };

  const handleGroupPageChange = (page: number) => {
    setGroupPage(page);
    loadGroups(page, groupSearch);
  };

  const handleExpensePageChange = (page: number) => {
    setExpensePage(page);
    loadExpenses(page, expenseSearch);
  };

  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Box p={4} mb="70px">
        <Accordion defaultIndex={[0]} allowMultiple>
          {/* Accordion para Cadastros */}
          <AccordionItem borderWidth={1} borderRadius="md" mb={4}>
            <AccordionButton bg="purple.100" _hover={{ bg: 'purple.200' }}>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Cadastros
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4}>
              {/* Lojas */}
              <Box mb={6}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="lg" fontWeight="medium">
                    Lojas
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    leftIcon={<FiPlus />}
                    onClick={() => handleResourceOpen('store')}
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
                    value={storeSearch}
                    onChange={handleStoreSearch}
                  />
                </InputGroup>

                {loading.stores ? (
                  <Flex justify="center" py={4}>
                    <Spinner color="purple.500" />
                  </Flex>
                ) : stores?.data?.length === 0 ? (
                  <Text textAlign="center" py={4}>
                    Nenhuma loja encontrada
                  </Text>
                ) : (
                  <>
                    <Table variant="simple">
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
                                <MenuButton
                                  as={Button}
                                  size="sm"
                                  variant="outline"
                                >
                                  Ações
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    icon={<FiEdit />}
                                    onClick={() =>
                                      handleResourceOpen('store', store)
                                    }
                                  >
                                    Editar
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    onClick={() =>
                                      handleDelete('store', store.id)
                                    }
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

                    {/* Paginação */}
                    {stores?.meta && stores.meta.totalPages > 1 && (
                      <Flex justify="flex-end" mt={4}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            size="sm"
                            onClick={() => handleStorePageChange(storePage - 1)}
                            isDisabled={storePage === 1}
                          >
                            Anterior
                          </Button>
                          <Button size="sm" variant="outline">
                            {storePage} / {stores.meta.totalPages}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStorePageChange(storePage + 1)}
                            isDisabled={storePage === stores.meta.totalPages}
                          >
                            Próxima
                          </Button>
                        </Stack>
                      </Flex>
                    )}
                  </>
                )}
              </Box>

              {/* Formas de Pagamento */}
              <Box mb={6}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="lg" fontWeight="medium">
                    Formas de Pagamento
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    leftIcon={<FiPlus />}
                    onClick={() => handleResourceOpen('payment')}
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
                    value={paymentSearch}
                    onChange={handlePaymentSearch}
                  />
                </InputGroup>

                {loading.payments ? (
                  <Flex justify="center" py={4}>
                    <Spinner color="purple.500" />
                  </Flex>
                ) : payments?.data?.length === 0 ? (
                  <Text textAlign="center" py={4}>
                    Nenhuma forma de pagamento encontrada
                  </Text>
                ) : (
                  <>
                    <Table variant="simple">
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
                                <MenuButton
                                  as={Button}
                                  size="sm"
                                  variant="outline"
                                >
                                  Ações
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    icon={<FiEdit />}
                                    onClick={() =>
                                      handleResourceOpen('payment', payment)
                                    }
                                  >
                                    Editar
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    onClick={() =>
                                      handleDelete('payment', payment.id)
                                    }
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

                    {/* Paginação */}
                    {payments?.meta && payments.meta.totalPages > 1 && (
                      <Flex justify="flex-end" mt={4}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            size="sm"
                            onClick={() =>
                              handlePaymentPageChange(paymentPage - 1)
                            }
                            isDisabled={paymentPage === 1}
                          >
                            Anterior
                          </Button>
                          <Button size="sm" variant="outline">
                            {paymentPage} / {payments.meta.totalPages}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handlePaymentPageChange(paymentPage + 1)
                            }
                            isDisabled={
                              paymentPage === payments.meta.totalPages
                            }
                          >
                            Próxima
                          </Button>
                        </Stack>
                      </Flex>
                    )}
                  </>
                )}
              </Box>

              {/* Grupos */}
              <Box mb={6}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="lg" fontWeight="medium">
                    Grupos
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    leftIcon={<FiPlus />}
                    onClick={() => handleResourceOpen('group')}
                  >
                    Novo Grupo
                  </Button>
                </Flex>

                <InputGroup mb={4}>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar grupos..."
                    value={groupSearch}
                    onChange={handleGroupSearch}
                  />
                </InputGroup>

                {loading.groups ? (
                  <Flex justify="center" py={4}>
                    <Spinner color="purple.500" />
                  </Flex>
                ) : groups?.data?.length === 0 ? (
                  <Text textAlign="center" py={4}>
                    Nenhum grupo encontrado
                  </Text>
                ) : (
                  <>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Nome</Th>
                          <Th>Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {groups?.data?.map((group) => (
                          <Tr key={group.id}>
                            <Td>{group.name}</Td>
                            <Td>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  size="sm"
                                  variant="outline"
                                >
                                  Ações
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    icon={<FiEdit />}
                                    onClick={() =>
                                      handleResourceOpen('group', group)
                                    }
                                  >
                                    Editar
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    onClick={() =>
                                      handleDelete('group', group.id)
                                    }
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

                    {/* Paginação */}
                    {groups?.meta && groups.meta.totalPages > 1 && (
                      <Flex justify="flex-end" mt={4}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            size="sm"
                            onClick={() => handleGroupPageChange(groupPage - 1)}
                            isDisabled={groupPage === 1}
                          >
                            Anterior
                          </Button>
                          <Button size="sm" variant="outline">
                            {groupPage} / {groups.meta.totalPages}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleGroupPageChange(groupPage + 1)}
                            isDisabled={groupPage === groups.meta.totalPages}
                          >
                            Próxima
                          </Button>
                        </Stack>
                      </Flex>
                    )}
                  </>
                )}
              </Box>
            </AccordionPanel>
          </AccordionItem>

          {/* Accordion para Despesas */}
          <AccordionItem borderWidth={1} borderRadius="md" mb={4}>
            <AccordionButton bg="red.100" _hover={{ bg: 'red.200' }}>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Despesas
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4}>
              {/* Despesas */}
              <Box mb={6}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="lg" fontWeight="medium">
                    Despesas
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<FiPlus />}
                    onClick={() => handleResourceOpen('expense')}
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
                    value={expenseSearch}
                    onChange={handleExpenseSearch}
                  />
                </InputGroup>

                {loading.expenses ? (
                  <Flex justify="center" py={4}>
                    <Spinner color="red.500" />
                  </Flex>
                ) : expenses?.data?.length === 0 ? (
                  <Text textAlign="center" py={4}>
                    Nenhuma despesa encontrada
                  </Text>
                ) : (
                  <>
                    <Table variant="simple">
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
                            <Td>{expense.payment.name || '-'}</Td>
                            <Td>{formatDateToBR(expense.date)}</Td>
                            <Td>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  size="sm"
                                  variant="outline"
                                >
                                  Ações
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    icon={<FiEdit />}
                                    onClick={() =>
                                      handleResourceOpen('expense', expense)
                                    }
                                  >
                                    Editar
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    onClick={() =>
                                      handleDelete('expense', expense.id)
                                    }
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

                    {/* Paginação */}
                    {expenses?.meta && expenses.meta.totalPages > 1 && (
                      <Flex justify="flex-end" mt={4}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleExpensePageChange(expensePage - 1)
                            }
                            isDisabled={expensePage === 1}
                          >
                            Anterior
                          </Button>
                          <Button size="sm" variant="outline">
                            {expensePage} / {expenses.meta.totalPages}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleExpensePageChange(expensePage + 1)
                            }
                            isDisabled={expensePage === expenses.meta.totalPages}
                          >
                            Próxima
                          </Button>
                        </Stack>
                      </Flex>
                    )}
                  </>
                )}
              </Box>
            </AccordionPanel>
          </AccordionItem>

          {/* Accordion para Receitas (exemplo) */}
          <AccordionItem borderWidth={1} borderRadius="md" mb={4}>
            <AccordionButton bg="green.100" _hover={{ bg: 'green.200' }}>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Receitas
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4}>
              <Text textAlign="center" py={4} color="gray.500">
                Em breve - Funcionalidade em desenvolvimento
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Modais */}
      {isSimpleOpen && !!currentResource && (
        <SimpleResourceModal
          isOpen={isSimpleOpen}
          onClose={() => {
            onSimpleClose();
            setEditingItem(null);
          }}
          resourceType={currentResource}
          onSuccess={() => {
            // Recarregar apenas a seção relevante após cadastro
            switch (currentResource) {
              case 'store':
                loadStores(storePage, storeSearch);
                break;
              case 'payment':
                loadPayments(paymentPage, paymentSearch);
                break;
              case 'group':
                loadGroups(groupPage, groupSearch);
                break;
            }
          }}
          initialData={editingItem}
        />
      )}

      {isCouponOpen && (
        <CouponModal
          isOpen={isCouponOpen}
          onClose={() => {
            onCouponClose();
            setEditingItem(null);
          }}
          stores={stores?.data || []}
          payments={payments?.data || []}
          groups={groups?.data || []}
          onSuccess={() => loadExpenses(expensePage, expenseSearch)}
          initialData={editingItem}
        />
      )}

      <NavigationBar />
    </Flex>
  );
};

export default NewResources;
