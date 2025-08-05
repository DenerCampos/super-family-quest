import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  Flex,
  useToast,
  Divider,
  Heading,
  Input,
  Checkbox,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { formatCurrencyBRL, formatCurrencyInputBRL, parseBRLCurrency } from '../../utils/formatCurrency';
import type { ExpenseComplete } from '../../services/expense';
import { parseGrams } from '../../utils/formatGrams';

type ExpenseItem = ExpenseComplete & {
  isSelected: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const NewRecurringExpenseModal = ({ isOpen, onClose }: Props) => {
  const toast = useToast();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar despesas repetidas
  useEffect(() => {
    const loadRepeatedExpenses = async () => {
      setIsLoading(true);
      try {
        const data = await api.getExpenseRecurring();
        // Mapear os dados para incluir o campo isSelected
        const mappedExpenses: ExpenseItem[] = data.map(
          (expense: ExpenseComplete) => ({
            ...expense,
            value: parseBRLCurrency(formatCurrencyInputBRL(
              expense.value.toString()),
            ),
            items: expense.items.map((item) => ({
              ...item,
              value: formatCurrencyInputBRL(item.value.toString()),
              total: formatCurrencyInputBRL(item.value.toString()),
            })),
            id: expense.id || crypto.randomUUID(),
            isSelected: true,
          }),
        );
        setExpenses(mappedExpenses);
      } catch (error) {
        console.error('Erro ao carregar despesas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as despesas repetidas',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadRepeatedExpenses();
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Filtrar apenas as despesas selecionadas e remover o campo isSelected      
      const selectedExpenses: ExpenseComplete[] = expenses
        .filter((expense) => expense.isSelected)
        .map(({ isSelected, ...expense }) => ({
          // eslint-disable-line @typescript-eslint/no-unused-vars
          ...expense,
          store: {
            ...expense.store,
            name: expense.name,
          },
          items: expense.items.map((item) => ({
            ...item,
            value: parseBRLCurrency(
              formatCurrencyInputBRL(item.value.toString()),
            ),
            total:
              Number(parseBRLCurrency(item.value).toFixed(2)) *
              Number(parseGrams(item.quantity)),
          })),
          value: expense.items.reduce(
            (sum, item) =>
              sum +
              Number(parseBRLCurrency(item.value).toFixed(2)) *
                Number(parseGrams(item.quantity)),
            0,
          ),
        }));

      const expenseIds = expenses.map((expense) => expense.id).filter((id): id is string => id !== undefined);

      await api.recurringExpenseConfirm({
        expenses: selectedExpenses,
        expenseIds,
      });

      toast({
        title: 'Despesas confirmadas!',
        description: 'Suas despesas recorrentes foram atualizadas com sucesso',
        status: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao confirmar despesas:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao confirmar as despesas',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpenseChange = (id: string | undefined, field: 'name' | 'value', value: string) => {
    if (!id) return;
    
    setExpenses((prevExpenses) => 
      prevExpenses.map((expense) => {
        if (expense.id === id) {
          // Agora só permite alterar o nome, já que o valor é calculado automaticamente
          if (field === 'name') {
            return { ...expense, name: value };
          }
          return expense;
        }
        return expense;
      })
    );
  };

  const handleItemChange = (expenseId: string | undefined, itemIndex: number, field: 'name' | 'value', value: string) => {
    if (!expenseId) return;

    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) => {
        if (expense.id === expenseId) {
          const updatedItems = [...expense.items];
          if (field === 'value') {            
            const numericValue = formatCurrencyInputBRL(value);
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], value: numericValue };
          } else {
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], name: value };
          }
          
          // Calcula o novo valor total baseado na soma dos itens
          const totalValue = updatedItems.reduce((sum, item) => {
            const itemValue = typeof item.value === 'string' ? parseBRLCurrency(item.value) : item.value;
            console.log(itemValue);
            return sum + (itemValue * (typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity));
          }, 0);
          
          return { 
            ...expense, 
            items: updatedItems,
            value: totalValue // Atualiza o valor total da despesa
          };
        }
        return expense;
      })
    );
  };

  const handleSelectionChange = (id: string | undefined, isSelected: boolean) => {
    if (!id) return;
    
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, isSelected } : expense
      )
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size="lg"
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="purple.800" color="white">
        <ModalHeader>🏰 Tributos do Reino! ⚔️</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4} fontSize="lg">
            Nobre Guardião do Tesouro, um novo ciclo lunar se inicia! É hora de
            revisar os tributos e custos do reino para manter nossa fortaleza
            próspera. 🏰
          </Text>

          <Heading size="md" mb={4} color="purple.300">
            Custos Recorrentes do Reino:
          </Heading>

          <Box
            maxH="300px"
            overflowY="auto"
            pr={2}
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'purple.500',
                borderRadius: '4px',
              },
            }}
          >
            {isLoading ? (
              <Text textAlign="center" py={4}>
                Consultando o Livro de Contas Real... 📚
              </Text>
            ) : expenses.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {expenses.map((expense) => (
                  <Box
                    key={expense.id}
                    bg={expense.isSelected ? 'purple.700' : 'purple.900'}
                    borderRadius="md"
                    p={3}
                    opacity={expense.isSelected ? 1 : 0.7}
                    transition="all 0.2s"
                  >
                    <Flex direction="column" gap={3}>
                      <Flex
                        justify="space-between"
                        align="center"
                        gap={2}
                        w="100%"
                      >
                        <HStack spacing={2} flex={1}>
                          <Checkbox
                            isChecked={expense.isSelected}
                            onChange={(e) =>
                              handleSelectionChange(
                                expense.id,
                                e.target.checked,
                              )
                            }
                            colorScheme="green"
                          />
                          <Input
                            value={expense.name}
                            onChange={(e) =>
                              handleExpenseChange(
                                expense.id,
                                'name',
                                e.target.value,
                              )
                            }
                            variant="filled"
                            bg="purple.600"
                            _hover={{ bg: 'purple.500' }}
                            _focus={{ bg: 'purple.500' }}
                            size="sm"
                            isDisabled={!expense.isSelected}
                          />
                        </HStack>
                        <Input
                          value={formatCurrencyBRL(expense.value.toString())}
                          variant="filled"
                          bg="purple.600"
                          _hover={{ bg: 'purple.500' }}
                          _focus={{ bg: 'purple.500' }}
                          size="sm"
                          width="150px"
                          textAlign="right"
                          isDisabled={true}
                          readOnly
                        />
                      </Flex>

                      <Accordion allowToggle>
                        <AccordionItem border="none">
                          <AccordionButton
                            _hover={{ bg: 'purple.600' }}
                            borderRadius="md"
                            p={2}
                          >
                            <Box flex="1" textAlign="left">
                              <Text fontSize="sm" color="purple.200">
                                Itens ({expense.items.length})
                              </Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <VStack spacing={2} align="stretch">
                              {expense.items.map((item, index) => (
                                <Flex
                                  key={item.id || index}
                                  gap={2}
                                  bg="purple.600"
                                  p={2}
                                  borderRadius="md"
                                >
                                  <Input
                                    value={item.name}
                                    onChange={(e) =>
                                      handleItemChange(
                                        expense.id,
                                        index,
                                        'name',
                                        e.target.value,
                                      )
                                    }
                                    variant="filled"
                                    bg="purple.500"
                                    _hover={{ bg: 'purple.400' }}
                                    _focus={{ bg: 'purple.400' }}
                                    size="sm"
                                    flex={1}
                                    isDisabled={!expense.isSelected}
                                  />
                                  <Input
                                    value={String(item.value).replace('.', ',')}
                                    onChange={(e) =>
                                      handleItemChange(
                                        expense.id,
                                        index,
                                        'value',
                                        e.target.value,
                                      )
                                    }
                                    variant="filled"
                                    bg="purple.500"
                                    _hover={{ bg: 'purple.400' }}
                                    _focus={{ bg: 'purple.400' }}
                                    size="sm"
                                    width="120px"
                                    textAlign="right"
                                    isDisabled={!expense.isSelected}
                                  />
                                </Flex>
                              ))}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text textAlign="center" py={4} color="gray.400">
                Nenhum tributo recorrente encontrado no reino 🏰
              </Text>
            )}
          </Box>

          <Divider my={4} borderColor="purple.600" />

          <Text fontSize="sm" color="purple.200">
            Ajuste os valores dos tributos conforme necessário e desmarque
            aqueles que não devem ser mantidos neste ciclo lunar. Um reino
            próspero depende de uma gestão sábia dos recursos! 🗡️
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            loadingText="Atualizando os Tributos..."
          >
            Decretar os Tributos ✨
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 