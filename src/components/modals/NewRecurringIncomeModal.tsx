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
import type { Revenue } from '../../services/revenue';
import type { RevenueItem } from '../../types/revenue';
import { useThemeTranslation } from '../../hooks/useThemeTranslation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const NewRecurringIncomeModal = ({ isOpen, onClose }: Props) => {
  const toast = useToast();
  const { t } = useThemeTranslation();
  const [incomes, setIncomes] = useState<RevenueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar receitas repetidas
  useEffect(() => {
    const loadRepeatedIncomes = async () => {
      setIsLoading(true);
      try {
        const data = await api.getIncomeRecurring();
        // Mapear os dados para incluir o campo isSelected
        const mappedIncomes: RevenueItem[] = data.map((income: Revenue) => ({
          id: income.id || crypto.randomUUID(),
          name: income.name,
          value: income.value,
          repeat: income.repeat,
          date: income.date,
          isSelected: true,
        }));
        setIncomes(mappedIncomes);
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
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
      loadRepeatedIncomes();
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Filtrar apenas as receitas selecionadas e remover o campo isSelected      
      const selectedIncomes: Revenue[] = incomes
        .filter((income) => income.isSelected)
        .map(({ isSelected, ...income }) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
          ...income,
          value: parseBRLCurrency(formatCurrencyInputBRL(income.value.toString())),
        }));

      const revenueIds = incomes.map((income) => income.id);

      await api.recurringIncomeConfirm({
        revenues: selectedIncomes,
        revenueIds,
      });

      toast({
        title: t('modals.recurringIncome.confirmed'),
        description: t('modals.recurringIncome.success'),
        status: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao confirmar receitas:', error);
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

  const handleIncomeChange = (id: string | undefined, field: 'name' | 'value', value: string) => {
    if (!id) return;
    
    setIncomes((prevIncomes) => 
      prevIncomes.map((income) => {
        if (income.id === id) {
          if (field === 'value') {
            const numericValue = formatCurrencyInputBRL(value);
            return { ...income, value: numericValue };
          }
          return { ...income, name: value };
        }
        return income;
      }) as RevenueItem[]
    );
  };

  const handleSelectionChange = (id: string | undefined, isSelected: boolean) => {
    if (!id) return;
    
    setIncomes((prevIncomes) =>
      prevIncomes.map((income) =>
        income.id === id ? { ...income, isSelected } : income
      )
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Impede o fechamento
      closeOnOverlayClick={false} // Impede fechar clicando fora
      size="lg"
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="purple.800" color="white">
        <ModalHeader>{t('modals.recurringIncome.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4} fontSize="lg">
            {t('modals.recurringIncome.description')}
          </Text>

          <Heading size="md" mb={4} color="purple.300">
            {t('modals.recurringIncome.sources')}:
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
                {t('common.loading')}
              </Text>
            ) : incomes.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {incomes.map((income) => (
                  <Box
                    key={income.id}
                    bg={income.isSelected ? 'purple.700' : 'purple.900'}
                    borderRadius="md"
                    p={3}
                    opacity={income.isSelected ? 1 : 0.7}
                    transition="all 0.2s"
                    minH="48px"
                    display="flex"
                    alignItems="center"
                  >
                    <Flex justify="space-between" align="center" gap={2} w="100%">
                      <HStack spacing={2} flex={1}>
                        <Checkbox
                          isChecked={income.isSelected}
                          onChange={(e) =>
                            handleSelectionChange(income.id, e.target.checked)
                          }
                          colorScheme="green"
                        />
                        <Input
                          value={income.name}
                          onChange={(e) =>
                            handleIncomeChange(
                              income.id,
                              'name',
                              e.target.value
                            )
                          }
                          variant="filled"
                          bg="purple.600"
                          _hover={{ bg: 'purple.500' }}
                          _focus={{ bg: 'purple.500' }}
                          size="sm"
                          isDisabled={!income.isSelected}
                        />
                      </HStack>
                      <Input
                        value={String(income.value).replace('.', ',')}
                        onChange={(e) =>
                          handleIncomeChange(income.id, 'value', e.target.value)
                        }
                        variant="filled"
                        bg="purple.600"
                        _hover={{ bg: 'purple.500' }}
                        _focus={{ bg: 'purple.500' }}
                        size="sm"
                        width="150px"
                        textAlign="right"
                        isDisabled={!income.isSelected}
                      />
                    </Flex>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text textAlign="center" py={4} color="gray.400">
                {t('modals.recurringIncome.noSourcesFound')}
              </Text>
            )}
          </Box>

          <Divider my={4} borderColor="purple.600" />

          <Text fontSize="sm" color="purple.200">
            {t('modals.recurringIncome.reminder')}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            loadingText={t('modals.recurringIncome.confirming')}
          >
            {t('modals.recurringIncome.sealDecree')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
