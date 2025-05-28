import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { api } from '../../services';
import { useEffect } from 'react';
import {
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from '../../utils/formatCurrency';

type Props = {
  isOpen: boolean;
  user: {
    email: string;
    name: string;
  };
  onComplete: () => void;
};

type FormData = {
  family: string;
  income: string;
};

export const CompleteProfileModal = ({ isOpen, user, onComplete }: Props) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // Preencher automaticamente o sobrenome
  useEffect(() => {
    if (user?.name) {
      const names = user.name.split(' ');
      const lastName = names[names.length - 1];
      setValue('family', lastName);
    }
  }, [user]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.completeProfile({
        family: data.family,
        income: parseBRLCurrency(data.income),
      });

      toast({
        title: 'Perfil atualizado!',
        status: 'success',
        description: 'Seus dados foram salvos com sucesso',
        duration: 3000,
      });

      onComplete();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Erro',
        status: 'error',
        description: 'Falha ao salvar dados do perfil',
        duration: 3000,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Impede o fechamento
      closeOnOverlayClick={false} // Impede fechar clicando fora
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="purple.800" color="white">
        <ModalHeader>Complete seu perfil</ModalHeader>

        <ModalBody pb={6}>
          <Text mb={4}>
            Bem-vindo(a) ao nosso sistema! Por favor, complete estas informações
            para continuar. Você poderá alterá-las depois no seu perfil.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.family} mb={4}>
              <FormLabel>Nome da Família</FormLabel>
              <Input
                {...register('family', {
                  required: 'Este campo é obrigatório',
                })}
                placeholder="Digite o nome da sua família"
                bg="purple.100"
                color="purple.800"
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: '0 0 0 1px purple.500',
                }}
              />
              {errors.family && (
                <Text color="red.300" fontSize="sm">
                  {errors.family.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.income} mb={6}>
              <FormLabel>Renda Mensal</FormLabel>
              <Input
                {...register('income', {
                  required: 'Este campo é obrigatório',
                  validate: (value) => {
                    const numericValue = parseBRLCurrency(value);
                    return numericValue > 0 || 'Valor inválido';
                  },
                })}
                onChange={(e) => {
                  const formatted = formatCurrencyInputBRL(e.target.value);
                  e.target.value = formatted;
                }}
                placeholder="R$ 0,00"
                bg="purple.100"
                color="purple.800"
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: '0 0 0 1px purple.500',
                }}
              />
              {errors.income && (
                <Text color="red.300" fontSize="sm">
                  {errors.income.message}
                </Text>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              w="full"
              isLoading={isSubmitting}
            >
              Salvar e Continuar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
