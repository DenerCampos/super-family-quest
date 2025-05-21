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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'store' | 'payment' | 'group';
  onSuccess: () => void;
};

const resourceNames = {
  store: 'Nova Loja',
  payment: 'Nova Forma de Pagamento',
  group: 'Novo Grupo de Produtos',
};

export const SimpleResourceModal = ({
  isOpen,
  onClose,
  resourceType,
  onSuccess,
}: Props) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
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

      const mappingApiResources = {
        store: api.resources.createStore(formattedData),
        payment: api.resources.createPayment(formattedData),
        group: api.resources.createGroup(formattedData),
      };

      await mappingApiResources[resourceType];

      toast({
        title: 'Sucesso!',
        status: 'success',
        description: `${resourceNames[resourceType]} cadastrado com sucesso`,
        duration: 3000,
      });

      onSuccess();
      reset();
      onClose();
    } catch (error) {
      console.log(error);
      
      toast({
        title: 'Erro',
        status: 'error',
        description: 'Falha ao cadastrar',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    reset();
  }, [resourceType, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      closeOnOverlayClick={!isSubmitting}
    >
      <ModalOverlay />

      <ModalContent bg="purple.800" color="white">
        {isSubmitting && <LoadingOverlay />}

        <ModalHeader>{resourceNames[resourceType]}</ModalHeader>

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
                  // pattern: {
                  //   value: /^[a-zA-ZÀ-ú\s]+$/,
                  //   message: 'Apenas letras são permitidas',
                  // },
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
              Salvar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
