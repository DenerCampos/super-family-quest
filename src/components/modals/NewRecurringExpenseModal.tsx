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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { formatCurrencyInputBRL, parseBRLCurrency } from '../../utils/formatCurrency';
import type { ExpenseComplete } from '../../services/expense';

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
        const mappedExpenses: ExpenseItem[] = data.map((expense: ExpenseComplete) => ({
          ...expense,
          id: expense.id || crypto.randomUUID(),
          isSelected: true,
        }));
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
        .map(({ isSelected, ...expense }) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
          ...expense,
          value: parseBRLCurrency(
            formatCurrencyInputBRL(expense.value.toString()),
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
          if (field === 'value') {
            const numericValue = formatCurrencyInputBRL(value);
            return { ...expense, value: numericValue };
          }
          return { ...expense, name: value };
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
            Nobre Guardião do Tesouro, um novo ciclo lunar se inicia! É hora de revisar os tributos e custos do reino para manter nossa fortaleza próspera. 🏰
          </Text>

          <Heading size="md" mb={4} color="purple.300">
            Custos Recorrentes do Reino:
          </Heading>

          <Box
            maxH="200px"
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
                    minH="48px"
                    display="flex"
                    alignItems="center"
                  >
                    <Flex justify="space-between" align="center" gap={2} w="100%">
                      <HStack spacing={2} flex={1}>
                        <Checkbox
                          isChecked={expense.isSelected}
                          onChange={(e) =>
                            handleSelectionChange(expense.id, e.target.checked)
                          }
                          colorScheme="green"
                        />
                        <Input
                          value={expense.name}
                          onChange={(e) =>
                            handleExpenseChange(
                              expense.id,
                              'name',
                              e.target.value
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
                        value={String(expense.value).replace('.', ',')}
                        onChange={(e) =>
                          handleExpenseChange(expense.id, 'value', e.target.value)
                        }
                        variant="filled"
                        bg="purple.600"
                        _hover={{ bg: 'purple.500' }}
                        _focus={{ bg: 'purple.500' }}
                        size="sm"
                        width="150px"
                        textAlign="right"
                        isDisabled={!expense.isSelected}
                      />
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
            Ajuste os valores dos tributos conforme necessário e desmarque aqueles que não devem ser mantidos neste ciclo lunar. Um reino próspero depende de uma gestão sábia dos recursos! 🗡️
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