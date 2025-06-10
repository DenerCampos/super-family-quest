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
  Grid,
  Button,
  Card,
  Flex,
  useToast,
  Text,
  Box,
  useDisclosure,
  Icon,
  Collapse,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useForm, useFieldArray } from 'react-hook-form';
import { api } from '../../services';
import { useEffect, useState } from 'react';
import type {
  Coupom,
  Groups,
  Merchant,
  Payments,
} from '../../services/resources';
import { LoadingOverlay } from '../LoadingOverlay';
import {
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from '../../utils/formatCurrency';
import { AutocompleteInput } from '../AutocompleteInput';
import { useAuth } from '../../contexts/AuthContext';

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
  initialData?: Partial<Coupom> | null;
  setScannedData?: React.Dispatch<React.SetStateAction<Coupom | null>>;
  handleNewRegistration: () => void;
};

export const CouponModal = ({
  isOpen,
  onClose,
  stores,
  payments,
  groups,
  onSuccess,
  initialData,
  setScannedData,
  handleNewRegistration,
}: Props) => {
  const { loadProfile } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isItemsCollapsed, onToggle: toggleItemsCollapsed } =
    useDisclosure({ defaultIsOpen: false });
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
    watch,
    formState: { errors, isValid, isSubmitting },
    setValue,
    trigger,
  } = useForm<Coupom>({
    mode: 'onChange',
    defaultValues: {
      number: '1',
      date: new Date().toISOString().split('T')[0],
      store: '',
      payment: '',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true);

      try {
        if (stores.length > 0 && payments.length > 0 && groups.length > 0) {
          const baseData = initialData || {
            number: '1',
            date: new Date().toISOString().split('T')[0],
            store: stores[0].name,
            payment: payments[0].name,
            items: [
              {
                ...defaultItem,
                group: groups[0].name,
              },
            ],
          };

          reset(baseData, {
            keepDefaultValues: false,
            keepDirty: false,
            keepErrors: false,
            keepIsValid: false,
            keepTouched: false,
            keepIsSubmitted: false,
            keepSubmitCount: false,
          });
        }

        setTimeout(() => {
          trigger(); // Força validação de todos os campos
        }, 300);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro',
          status: 'error',
          description: 'Falha ao carregar dados do formulário',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [stores, payments, groups, initialData, trigger]);

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
        payment: {
          name: data.payment,
        },
        store: {
          name: data.store,
        },
        items: data.items.map((item) => ({
          ...item,
          value: Number(parseBRLCurrency(item.value).toFixed(2)),
          quantity: Number(item.quantity),
          total:
            item.total === 0
              ? Number(parseBRLCurrency(item.value).toFixed(2)) *
                Number(item.quantity)
              : item.total,
          group: {
            name: item.group,
          },
        })),
      };

      await api.createCoupon(formattedData);

      // Recarregar perfil após sucesso
      await loadProfile();

      toast({
        title: 'Sucesso!',
        status: 'success',
        description: 'Cupom cadastrado com sucesso',
        duration: 3000,
      });

      onSuccess();
      reset();
      if (setScannedData) setScannedData(null);
      onClose();
      handleNewRegistration(); // Atualiza a lista de cupons
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        status: 'error',
        description: 'Falha ao cadastrar despesa',
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="purple.800" color="white">
        {(isSubmitting || isLoading) && (
          <LoadingOverlay
            text={isLoading ? 'Carregando formulário' : 'Salvando'}
          />
        )}
        <ModalHeader>🧾 Nova Despesa</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          {!isLoading ? (
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
                  <AutocompleteInput
                    value={watch('store') || ''}
                    options={stores.map((store) => store.name)}
                    onChange={(value) =>
                      setValue('store', value, { shouldValidate: true })
                    }
                    placeholder="Selecione ou digite uma loja"
                  />
                  {errors.store && (
                    <Text color="red.300" fontSize="sm">
                      {errors.store.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.payment}>
                  <FormLabel>Pagamento</FormLabel>
                  <AutocompleteInput
                    value={watch('payment') || ''}
                    options={payments.map((payment) => payment.name)}
                    onChange={(value) =>
                      setValue('payment', value, { shouldValidate: true })
                    }
                    placeholder="Selecione ou digite uma forma de pagamento"
                  />
                  {errors.payment && (
                    <Text color="red.300" fontSize="sm">
                      {errors.payment.message}
                    </Text>
                  )}
                </FormControl>
              </Grid>

              <FormControl mt={4}>
                <FormLabel>URL do Cupom</FormLabel>
                <Input {...register('url')} {...inputStyle} />
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.items}>
                <Flex justify="space-between" align="center" mb={2}>
                  <FormLabel>🧾 Itens da despesa</FormLabel>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    bg={'purple.500'}
                    _hover={{ bg: 'purple.800' }}
                    onClick={toggleItemsCollapsed}
                    rightIcon={
                      <Icon
                        as={FiChevronDown}
                        transform={isItemsCollapsed ? 'rotate(180deg)' : 'none'}
                      />
                    }
                  >
                    {isItemsCollapsed ? 'Ocultar' : 'Mostrar'} Itens
                  </Button>
                </Flex>

                <Collapse in={isItemsCollapsed} animateOpacity>
                  {fields.map((field, index) => (
                    <Card key={field.id} bg="purple.700" mb={4} p={4}>
                      <Flex direction="column" gap={4}>
                        <Grid
                          templateColumns={{
                            base: '1fr',
                            md: 'repeat(2, 1fr)',
                          }}
                          gap={4}
                        >
                          <FormControl
                            isInvalid={!!errors.items?.[index]?.code}
                          >
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

                          <FormControl
                            isInvalid={!!errors.items?.[index]?.name}
                          >
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
                          templateColumns={{
                            base: '1fr',
                            md: 'repeat(3, 1fr)',
                          }}
                          gap={4}
                        >
                          <FormControl
                            isInvalid={!!errors.items?.[index]?.quantity}
                          >
                            <FormLabel>Quantidade</FormLabel>
                            <Input
                              type="number"
                              step="0.001"
                              {...register(`items.${index}.quantity`, {
                                required: 'Campo obrigatório',
                                validate: (value) => {
                                  const numValue = Number(value);
                                  if (isNaN(numValue)) return 'Valor inválido';
                                  if (numValue <= 0)
                                    return 'Quantidade deve ser maior que 0';
                                  return true;
                                },
                                valueAsNumber: true,
                              })}
                              {...inputStyle}
                              size="sm"
                            />
                            {errors.items?.[index]?.quantity && (
                              <Text color="red.300" fontSize="sm">
                                {errors.items[index]?.quantity?.message}
                              </Text>
                            )}
                          </FormControl>

                          <FormControl
                            isInvalid={!!errors.items?.[index]?.unit}
                          >
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

                          <FormControl
                            isInvalid={!!errors.items?.[index]?.value}
                          >
                            <FormLabel>Valor Unitário</FormLabel>
                            <Input
                              type="text"
                              {...register(`items.${index}.value`, {
                                required: 'Campo obrigatório',
                                validate: (value) => {
                                  const numericValue = parseBRLCurrency(value);
                                  if (isNaN(numericValue))
                                    return 'Valor inválido';
                                  return (
                                    numericValue >= 0.01 ||
                                    'Valor deve ser maior que 0,00'
                                  );
                                },
                              })}
                              onChange={(e) => {
                                const formatted = formatCurrencyInputBRL(
                                  e.target.value,
                                );
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

                          <FormControl
                            isInvalid={!!errors.items?.[index]?.group}
                          >
                            <FormLabel>Grupo</FormLabel>
                            <AutocompleteInput
                              value={watch(`items.${index}.group`) || ''}
                              options={groups.map((group) => group.name)}
                              onChange={(value) =>
                                setValue(`items.${index}.group`, value, {
                                  shouldValidate: true,
                                })
                              }
                              placeholder="Selecione ou digite um grupo"
                            />
                            {errors.items?.[index]?.group && (
                              <Text color="red.300" fontSize="sm">
                                {errors.items[index]?.group?.message}
                              </Text>
                            )}
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
                </Collapse>
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
          ) : (
            // Espaço reservado para manter o layout
            <Box minH="300px" />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
