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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { api } from '../../services';
import { formatCurrencyBRL } from '../../utils/formatCurrency';
import type { Revenue } from '../../services/revenue';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
};

export const NewMonthIncomeModal = ({ isOpen, onClose, onEdit }: Props) => {
  const toast = useToast();
  const [incomes, setIncomes] = useState<Revenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar receitas repetidas
  useEffect(() => {
    const loadRepeatedIncomes = async () => {
      setIsLoading(true);
      try {
        const data = await api.getRepeatedIncomes();
        setIncomes(data);
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as receitas repetidas',
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
      await api.confirmNewMonthIncomes();    

      toast({
        title: 'Receitas confirmadas!',
        description: 'Seu novo mês foi iniciado com sucesso',
        status: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao confirmar receitas:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao confirmar as receitas',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <ModalHeader>⚔️ Novo Mês, Novas Conquistas! ⚔️ </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4} fontSize="lg">
            Combatente, você passou de fase! Confira se suas receitas aumentaram
            💰 ou diminuíram 💸.
          </Text>

          <Heading size="md" mb={4} color="purple.300">
            Receitas que se repetem:
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
                Carregando receitas...
              </Text>
            ) : incomes.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {incomes.map((income) => (
                  <Box key={income.id} bg="purple.700" borderRadius="md" p={3}>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold">{income.name}</Text>
                      <Text color="green.300">
                        R$ {formatCurrencyBRL(income.value)}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text textAlign="center" py={4} color="gray.400">
                Nenhuma receita repetida encontrada
              </Text>
            )}
          </Box>

          <Divider my={4} borderColor="purple.600" />

          <Text fontSize="sm" color="purple.200">
            Verifique se os valores estão corretos para o novo mês. Você pode
            editar as receitas ou confirmar para continuar.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="purple"
            variant="outline"
            mr={3}
            onClick={onEdit}
            isDisabled={isSubmitting}
          >
            Editar Receitas
          </Button>
          <Button
            colorScheme="green"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            loadingText="Confirmando..."
          >
            Tudo Certo, Confirmar!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
