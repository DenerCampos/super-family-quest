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
  Select,
  Grid,
  Button,
  Card,
  Flex,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { api } from '../../services';
import { useEffect } from 'react';
import type { Coupom, Groups, Merchant, Payments } from '../../services/resources';
import { LoadingOverlay } from '../LoadingOverlay';
import { formatCurrencyBRL, parseBRLCurrency } from '../../utils/formatCurrency';

const inputStyle = {
  bgColor: 'purple.100',
  color: 'purple.800',
  _focus: {
    borderColor: 'purple.500',
    boxShadow: '0 0 0 1px purple.500',
  },
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  stores: Merchant[];
  payments: Payments[];
  groups: Groups[];
  onSuccess: () => void;
};

export const CouponModal = ({
  isOpen,
  onClose,
  stores,
  payments,
  groups,
  onSuccess,
}: Props) => {
  const toast = useToast();
  const defaultItem = {
    code: '1',
    name: '',
    quantity: 1,
    unit: 'Unidade',
    value: '0,00',
    total: 0,
    group: groups[0]?.name || '',
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
    setValue,
  } = useForm<Coupom>({
    mode: 'onChange',
    defaultValues: {
      number: '1',
      date: new Date().toISOString().split('T')[0],
      store: '', // Valor inicial vazio
      payment: '', // Valor inicial vazio
      items: [], // Array vazio inicial
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (stores.length > 0 && payments.length > 0 && groups.length > 0) {
      const initialValues = {
        store: stores[0].name,
        payment: payments[0].name,
        items: [
          {
            ...defaultItem,
            group: groups[0].name,
          },
        ],
      };

      reset(
        {
          ...initialValues,
          number: '1',
          date: new Date().toISOString().split('T')[0],
        },
        {
          keepDefaultValues: false,
          keepDirty: false,
          keepErrors: false,
          keepIsValid: false,
          keepTouched: false,
          keepIsSubmitted: false,
          keepSubmitCount: false,
        },
      );
    }
  }, [stores, payments, groups]);

  const handleAddItem = () => {
    append(
      {
        ...defaultItem,
        group: groups[0]?.name || '',
      },
      {
        shouldFocus: false,
      },
    );
  };

  const onSubmit = async (data: Coupom) => {   
    try {
      const formattedData = {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          value: Number(parseBRLCurrency(item.value).toFixed(2)),
          quantity: Number(item.quantity),
        })),
      };     

      await api.resources.createCoupon(formattedData);

      toast({
        title: 'Sucesso!',
        status: 'success',
        description: 'Cupom cadastrado com sucesso',
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
        description: 'Falha ao cadastrar cupom',
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="purple.800" color="white">
        {isSubmitting && <LoadingOverlay />}
        <ModalHeader>Novo Cupom Fiscal</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl isInvalid={!!errors.number}>
                <FormLabel>Número</FormLabel>
                <Input
                  {...register('number', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: 'Apenas letras e números são permitidos',
                    },
                  })}
                  {...inputStyle}
                />
                {errors.number && (
                  <Text color="red.300" fontSize="sm">
                    {errors.number.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.date}>
                <FormLabel>Data</FormLabel>
                <Input
                  type="date"
                  {...register('date', {
                    required: 'Campo obrigatório',
                    valueAsDate: true,
                  })}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.store}>
                <FormLabel>Loja</FormLabel>
                <Select
                  {...register('store', { required: 'Selecione uma loja' })}
                  {...inputStyle}
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.payment}>
                <FormLabel>Pagamento</FormLabel>
                <Select
                  {...register('payment', {
                    required: 'Selecione um pagamento',
                  })}
                  {...inputStyle}
                >
                  {payments.map((payment) => (
                    <option key={payment.id} value={payment.name}>
                      {payment.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <FormControl mt={4}>
              <FormLabel>URL do Cupom</FormLabel>
              <Input {...register('url')} {...inputStyle} />
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.items}>
              <FormLabel>Itens (Mínimo 1)</FormLabel>
              {fields.map((field, index) => (
                <Card key={field.id} bg="purple.700" mb={4} p={4}>
                  <Flex direction="column" gap={4}>
                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                      gap={4}
                    >
                      <FormControl isInvalid={!!errors.items?.[index]?.code}>
                        <FormLabel>Código</FormLabel>
                        <Input
                          {...register(`items.${index}.code`, {
                            required: 'Código obrigatório',
                            pattern: {
                              value: /^[a-zA-Z0-9]+$/,
                              message: 'Apenas letras e números',
                            },
                          })}
                          {...inputStyle}
                          size="sm"
                        />
                        {errors.items?.[index]?.code && (
                          <Text color="red.300" fontSize="sm">
                            {errors.items[index]?.code?.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!errors.items?.[index]?.name}>
                        <FormLabel>Nome</FormLabel>
                        <Input
                          {...register(`items.${index}.name`, {
                            required: 'Nome obrigatório',
                            minLength: {
                              value: 3,
                              message: 'Mínimo 3 caracteres',
                            },
                          })}
                          {...inputStyle}
                          size="sm"
                        />
                        {errors.items?.[index]?.name && (
                          <Text color="red.300" fontSize="sm">
                            {errors.items[index]?.name?.message}
                          </Text>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                      gap={4}
                    >
                      <FormControl
                        isInvalid={!!errors.items?.[index]?.quantity}
                      >
                        <FormLabel>Quantidade</FormLabel>
                        <Input
                          type="number"
                          {...register(`items.${index}.quantity`, {
                            required: 'Campo obrigatório',
                            min: { value: 1, message: 'Mínimo 1' },
                            valueAsNumber: true,
                          })}
                          {...inputStyle}
                          size="sm"
                        />
                      </FormControl>

                      <FormControl isInvalid={!!errors.items?.[index]?.unit}>
                        <FormLabel>Unidade</FormLabel>
                        <Input
                          {...register(`items.${index}.unit`, {
                            required: 'Campo obrigatório',
                          })}
                          {...inputStyle}
                          size="sm"
                        />
                        {errors.items?.[index]?.unit && (
                          <Text color="red.300" fontSize="sm">
                            {errors.items[index]?.unit?.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!errors.items?.[index]?.value}>
                        <FormLabel>Valor Unitário</FormLabel>
                        <Input
                          type="text"
                          {...register(`items.${index}.value`, {
                            required: 'Campo obrigatório',
                            validate: (value) => {
                              const numericValue = parseBRLCurrency(value);
                              if (isNaN(numericValue)) return 'Valor inválido';
                              return (
                                numericValue >= 0.01 ||
                                'Valor deve ser maior que 0,00'
                              );
                            },
                          })}
                          onChange={(e) => {
                            const formatted = formatCurrencyBRL(e.target.value);
                            e.target.value = formatted;
                            setValue(`items.${index}.value`, formatted, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          {...inputStyle}
                          size="sm"
                        />
                        {errors.items?.[index]?.value && (
                          <Text color="red.300" fontSize="sm">
                            {errors.items[index]?.value?.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!errors.items?.[index]?.group}>
                        <FormLabel>Grupo</FormLabel>
                        <Select
                          {...register(`items.${index}.group`, {
                            required: 'Selecione um grupo',
                          })}
                          {...inputStyle}
                          size="sm"
                        >
                          {groups.map((group) => (
                            <option key={group.id} value={group.name}>
                              {group.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Button
                      onClick={() => remove(index)}
                      colorScheme="red"
                      size="sm"
                      alignSelf="flex-end"
                    >
                      Remover Item
                    </Button>
                  </Flex>
                </Card>
              ))}

              <Button
                onClick={handleAddItem}
                colorScheme="purple"
                mt={4}
                w="full"
              >
                Adicionar Item
              </Button>
            </FormControl>

            <Button
              mt={4}
              colorScheme="purple"
              type="submit"
              w="full"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
            >
              Salvar Cupom
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
