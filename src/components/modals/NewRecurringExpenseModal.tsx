import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
  Heading,
  Button,
  useToast,
  VStack,
  Flex,
  Checkbox,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { formatCurrencyBRL, formatCurrencyInputBRL, parseBRLCurrency } from '../../utils/formatCurrency';
import type { ExpenseComplete } from '../../services/expense';
import { parseGrams } from '../../utils/formatGrams';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type ExpenseItem = ExpenseComplete & {
  isSelected: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const NewRecurringExpenseModal = ({ isOpen, onClose }: Props) => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
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
          title: t('common.error'),
          description: t('common.loadError'),
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
        .map(({ isSelected, ...expense }) => ({// eslint-disable-line @typescript-eslint/no-unused-vars
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
        title: t('modals.recurringExpense.confirmed'),
        description: t('modals.recurringExpense.success'),
        status: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao confirmar despesas:', error);
      toast({
        title: t('common.error'),
        description: t('common.updateError'),
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
      <ModalContent
        bg={getColor('background.primary')}
        color={getColor('text.primary')}
      >
        <ModalHeader>{t('modals.recurringExpense.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4} fontSize="lg">
            {t('modals.recurringExpense.description')}
          </Text>

          <Heading size="md" mb={4} color={getColor('text.primary')}>
            {t('modals.recurringExpense.expenses')}:
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
                background: getColor('background.tertiary'),
                borderRadius: '4px',
              },
            }}
          >
            {isLoading ? (
              <Text textAlign="center" py={4}>
                {t('common.loading')}
              </Text>
            ) : expenses.length === 0 ? (
              <Text textAlign="center" py={4} color={getColor('text.inverted')}>
                {t('modals.recurringExpense.noExpensesFound')}
              </Text>
            ) : (
              <VStack spacing={3} align="stretch">
                {expenses.map((expense) => (
                  <Box
                    key={expense.id}
                    bg={
                      expense.isSelected
                        ? getColor('background.selected')
                        : getColor('background.tertiary')
                    }
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
                            colorScheme={getColor('chakraColors.green')}
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
                            bg={getColor('input.backgroundPrimary')}
                            _hover={{ bg: getColor('input.backgroundPrimary') }}
                            _focus={{ bg: getColor('input.backgroundPrimary') }}
                            size="sm"
                            isDisabled={!expense.isSelected}
                          />
                        </HStack>
                        <Input
                          value={formatCurrencyBRL(expense.value.toString())}
                          variant="filled"
                          bg={getColor('input.backgroundPrimary')}
                          _hover={{ bg: getColor('input.backgroundPrimary') }}
                          _focus={{ bg: getColor('input.backgroundPrimary') }}
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
                            _hover={{ bg: getColor('background.selected') }}
                            borderRadius="md"
                            p={2}
                          >
                            <Box flex="1" textAlign="left">
                              <Text fontSize="sm" color={getColor('text.primary')}>
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
                                  bg={getColor('background.tertiary')}
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
                                    bg={getColor('input.backgroundSecondary')}
                                    _hover={{ bg: getColor('input.backgroundSecondary') }}
                                    _focus={{ bg: getColor('input.backgroundSecondary') }}
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
                                    bg={getColor('input.backgroundSecondary')}
                                    _hover={{ bg: getColor('input.backgroundSecondary') }}
                                    _focus={{ bg: getColor('input.backgroundSecondary') }}
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
            )}
          </Box>

          <Divider my={4} borderColor={getColor('border.primary')} />

          <Text fontSize="sm" color={getColor('text.secondary')}>
            {t('modals.recurringExpense.reminder')}
          </Text>

          <Button
            mt={4}
            bg={getColor('background.secondary')}
            color={getColor('text.inverted')}
            _hover={{ bg: getColor('background.button.hover.primary') }}
            _focus={{ bg: getColor('background.button.hover.primary') }}
            w="full"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            loadingText={t('modals.recurringExpense.confirming')}
          >
            {t('modals.recurringExpense.sealDecree')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 