import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../services';
import { LoadingOverlay } from '../LoadingOverlay';
import type { Groups, Merchant, Payments } from '../../services/resources';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'store' | 'payment' | 'group';
  onSuccess: () => void;
  initialData?: { id: string; name: string };
};

type ApiResources = {
  [key in Props['resourceType']]: (data: { name: string }) => Promise<Merchant | Payments | Groups>;
};

type UpdateResources = {
  [key in Props['resourceType']]: (
    id: string,
    data: { name: string },
  ) => Promise<Merchant | Payments | Groups>;
};

const resourceNames = {
  store: 'Nova Loja',
  payment: 'Nova Forma de Pagamento',
  group: 'Novo Grupo de Produtos',
};

const editResourceNames = {
  store: 'Editar Loja',
  payment: 'Editar Forma de Pagamento',
  group: 'Editar Grupo de Produtos',
};

export const SimpleResourceModal = ({
  isOpen,
  onClose,
  resourceType,
  onSuccess,
  initialData,
}: Props) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<{ name: string }>({
    mode: 'onChange',
    defaultValues: { name: '' },
  });

  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const onSubmit = async (data: { name: string }) => {
    try {
      const formattedData = {
        name: formatName(data.name),
      };

      // Mapeamento para criação
      const mappingApiResources: ApiResources = {
        store: (data) => api.createStore(data),
        payment: (data) => api.createPayment(data),
        group: (data) => api.createGroup(data),
      };

      // Mapeamento para atualização
      const mappingUpdateResources: UpdateResources = {
        store: (id, data) => api.updateStore({ id, name: data.name }),
        payment: (id, data) => api.updatePayment({ id, name: data.name }),
        group: (id, data) => api.updateGroup({ id, name: data.name }),
      };

      // Se tivermos initialData, estamos editando
      if (initialData && initialData.id) {
        await mappingUpdateResources[resourceType](
          initialData.id,
          formattedData,
        );
        toast({
          title: 'Atualizado!',
          status: 'success',
          description: `${editResourceNames[resourceType]} atualizado com sucesso`,
          duration: 3000,
        });
      } else {
        // Caso contrário, estamos criando
        await mappingApiResources[resourceType](formattedData);
        toast({
          title: 'Sucesso!',
          status: 'success',
          description: `${resourceNames[resourceType]} cadastrado com sucesso`,
          duration: 3000,
        });
      }

      onSuccess();
      reset();
      onClose();
    } catch (error) {
      console.error(error);

      toast({
        title: 'Erro',
        status: 'error',
        description: initialData ? 'Falha ao atualizar' : 'Falha ao cadastrar',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    reset();
  }, [resourceType, reset]);

  // Preencher o formulário quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      closeOnOverlayClick={!isSubmitting}
    >
      <ModalOverlay />

      <ModalContent bg="purple.800" color="white">
        {isSubmitting && <LoadingOverlay />}

        <ModalHeader>
          {initialData
            ? editResourceNames[resourceType]
            : resourceNames[resourceType]}
        </ModalHeader>

        <ModalCloseButton isDisabled={isSubmitting} />

        <ModalBody pb={4} opacity={isSubmitting ? 0.5 : 1}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name}>
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
                placeholder="Informe o nome"
                isDisabled={isSubmitting}
              />

              {errors.name && (
                <Text color="red.300" fontSize="sm" mt={1}>
                  {errors.name.message}
                </Text>
              )}
            </FormControl>

            <Button
              mt={4}
              colorScheme="purple"
              type="submit"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              loadingText="Salvando..."
              w="full"
            >
              {initialData ? 'Atualizar' : 'Salvar'}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
