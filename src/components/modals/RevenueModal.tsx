import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../services';
import { LoadingOverlay } from '../LoadingOverlay';
import { formatCurrencyInputBRL, parseBRLCurrency } from '../../utils/formatCurrency';

type RevenueModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  handleNewRegistration: () => void;
  initialData?: {
    id?: string;
    name: string;
    value: number;
    repeat: boolean;
    date?: string;
  };
};

export const RevenueModal = ({
  isOpen,
  onClose,
  onSuccess,
  handleNewRegistration,
  initialData,
}: RevenueModalProps) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      name: '',
      value: '',
      repeat: false,
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Preencher o formulário quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('value', formatCurrencyInputBRL(initialData.value.toString()));
      setValue('repeat', initialData.repeat);
      setValue('date', initialData.date || new Date().toISOString().split('T')[0]);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const onSubmit = async (data: { name: string; value: string; date: string; repeat: boolean }) => {
    try {
      const payload = {
        name: data.name,
        value: parseBRLCurrency(data.value),
        date: data.date,
        repeat: data.repeat,
      };

      console.log('payload', payload);

      if (initialData?.id) {
        await api.updateRevenue(initialData.id, payload);
        toast({
          title: 'Receita atualizada!',
          status: 'success',
          duration: 3000,
        });
      } else {
        await api.createRevenue(payload);
        toast({
          title: 'Receita criada!',
          status: 'success',
          duration: 3000,
        });
      }

      onSuccess();
      reset();
      if (handleNewRegistration) handleNewRegistration();
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: initialData ? 'Falha ao atualizar' : 'Falha ao cadastrar',
        status: 'error',
        duration: 3000,
      });
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      closeOnOverlayClick={!isSubmitting}
      size="md"
    >
      <ModalOverlay />

      <ModalContent bg="purple.800" color="white">
        {isSubmitting && <LoadingOverlay />}

        <ModalHeader>
          {initialData ? '🧾 Editar Receita' : '🧾 Nova Receita'}
        </ModalHeader>

        <ModalCloseButton isDisabled={isSubmitting} />

        <ModalBody pb={4} opacity={isSubmitting ? 0.5 : 1}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel>Nome</FormLabel>
              <Input
                {...register('name', {
                  required: 'Campo obrigatório',
                  minLength: {
                    value: 3,
                    message: 'Mínimo 3 caracteres',
                  },
                })}
                bg="white"
                color="black"
                placeholder="Nome da receita"
                isDisabled={isSubmitting}
              />
              {errors.name && (
                <Text color="red.300" fontSize="sm" mt={1}>
                  {errors.name.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.value} mb={4}>
              <FormLabel>Valor</FormLabel>
              <Input
                value={watch('value')}
                {...register('value', {
                  required: 'Campo obrigatório',
                  validate: (value) => {
                    const numericValue = parseBRLCurrency(value);
                    if (isNaN(numericValue)) return 'Valor inválido';
                    return (
                      numericValue >= 0.01 || 'Valor deve ser maior que 0,00'
                    );
                  },
                })}
                onChange={(e) => {
                  const formatted = formatCurrencyInputBRL(e.target.value);
                  setValue('value', formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                bg="white"
                color="black"
                placeholder="0,00"
                isDisabled={isSubmitting}
              />
              {errors.value && (
                <Text color="red.300" fontSize="sm" mt={1}>
                  {errors.value.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.date} mb={4}>
              <FormLabel>Data</FormLabel>
              <Input
                type="date"
                {...register('date', {
                  required: 'Campo obrigatório',
                })}
                bg="white"
                color="black"
                isDisabled={isSubmitting}
              />
              {errors.date && (
                <Text color="red.300" fontSize="sm" mt={1}>
                  {errors.date.message}
                </Text>
              )}
            </FormControl>

            <FormControl mb={4}>
              <Checkbox {...register('repeat')} colorScheme="green" size="lg">
                Repete todo mês?
              </Checkbox>
            </FormControl>

            <Flex justify="flex-end">
              <Button
                colorScheme="purple"
                type="submit"
                isDisabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                loadingText="Salvando..."
              >
                {initialData ? 'Atualizar' : 'Salvar'}
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
