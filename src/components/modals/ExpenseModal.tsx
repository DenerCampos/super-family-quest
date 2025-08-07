import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
  Flex,
  useToast,
  Text,
  Box,
  useDisclosure,
  Icon,
  Collapse,
  Checkbox,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useForm, useFieldArray } from 'react-hook-form';
import { api } from '../../services';
import { useEffect, useState } from 'react';
import type {
  Expense,
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
import { formatGramsInput, parseGrams } from '../../utils/formatGrams';
import { useThemeTranslation } from '../../hooks/useThemeTranslation';

const inputStyle = {
  bgColor: 'purple.100',
  color: 'purple.800',
  _focus: {
    borderColor: 'purple.500',
    boxShadow: '0 0 0 1px purple.500',
  },
};

const smallInputStyle = {
  ...inputStyle,
  size: 'sm',
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  stores: Merchant[];
  payments: Payments[];
  groups: Groups[];
  onSuccess: () => void;
  initialData?: Partial<Expense> | null;
  setScannedData?: React.Dispatch<React.SetStateAction<Expense | null>>;
  handleNewRegistration?: () => void;
};

export const ExpenseModal = ({
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
  const { t } = useThemeTranslation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [removedItemIds, setRemovedItemIds] = useState<string[]>([]);
  const [expandedItemIndex, setExpandedItemIndex] = useState<number>(0);
  const { isOpen: isItemsCollapsed, onToggle: toggleItemsCollapsed } =
    useDisclosure({ defaultIsOpen: false });

  const defaultItem = {
    code: '1',
    name: '',
    quantity: '1',
    unit: 'Unidade',
    value: '0,00',
    total: 0,
    group: {
      name: groups[0]?.name || '',
    },
  };

  const defaultExpense = {
    name: '',
    uri: '',
    value: 0,
    repeat: false,
    date: new Date().toISOString().split('T')[0],
    store: {
      name: stores[0]?.name || '',
    },
    payment: {
      name: payments[0]?.name || '',
    },
    items: [defaultItem],
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
  } = useForm<Expense>({
    mode: 'onChange',
    defaultValues: defaultExpense,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (stores.length > 0 && payments.length > 0 && groups.length > 0) {
      setIsLoading(true);

      if (initialData) {
        initialData.date = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        initialData.items?.forEach((item) => {
          item.value = formatCurrencyInputBRL(item.value.toString());
        });
      }

      const baseData = initialData || {
        name: '',
        uri: '',
        value: 0,
        repeat: false,
        date: new Date().toISOString().split('T')[0],
        store: { name: stores[0]?.name || '' },
        payment: { name: payments[0]?.name || '' },
        items: [
          {
            ...defaultItem,
            group: { name: groups[0]?.name || '' },
          },
        ],
      };

      reset(baseData);

      // Trigger validation after a short delay to ensure form is fully initialized
      setTimeout(() => {
        trigger();
        setIsLoading(false);
      }, 100);
    }
  }, [stores, payments, groups, initialData, reset, trigger]);

  const handleAddItem = () => {
    const newIndex = fields.length;
    append({
      ...defaultItem,
      group: { name: groups[0]?.name || '' },
    });

    setTimeout(() => {
      setExpandedItemIndex(newIndex);
    }, 0);
  };

  const onSubmit = async (data: Expense) => {
    try {
      const formattedData = {
        ...data,
        name: data.store.name.trim(),
        value: data.items.reduce((sum, item) => 
          sum + (Number(parseBRLCurrency(item.value).toFixed(2)) * Number(parseGrams(item.quantity))), 0),
        items: data.items.map((item) => ({
          ...item,
          value: Number(parseBRLCurrency(item.value).toFixed(2)),
          quantity: Number(parseGrams(item.quantity)),
          total:
            item.total = Number(parseBRLCurrency(item.value).toFixed(2)) * Number(parseGrams(item.quantity))
        })),
      };

      if (initialData?.id) {
        await api.updateExpense(initialData.id, {
          ...formattedData,
          id: initialData.id,
          items: formattedData.items.map((item) => ({
            ...item,
            id: item.id || '',
          })),
          removedItemIds, // Adicionando os IDs dos itens removidos
        });
      } else {
        await api.createExpense(formattedData);
      }

      await loadProfile();

      toast({
        title: t('common.success'),
        status: 'success',
        description: t('modals.expense.success'),
        duration: 3000,
      });

      onSuccess();
      reset();
      if (setScannedData) setScannedData(null);
      onClose();
      if (handleNewRegistration) handleNewRegistration();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        status: 'error',
        description: t('common.createError'),
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="purple.800" color="white">
          <LoadingOverlay text={t('common.loading')} />
          <ModalHeader>{t('modals.expense.new')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <Box minH="300px" />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="purple.800" color="white">
        {isSubmitting && <LoadingOverlay text={t('common.saving')} />}
        <ModalHeader>
          {initialData ? t('modals.expense.edit') : t('modals.expense.new')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Campo Loja */}
            <FormControl isInvalid={!!errors.store?.name} mb={4}>
              <FormLabel>Loja</FormLabel>
              <AutocompleteInput
                value={watch('store.name') || ''}
                options={stores.map((store) => store.name)}
                onChange={(value) =>
                  setValue('store.name', value, { shouldValidate: true })
                }
                placeholder={t('modals.expense.storePlaceholder')}
              />
              {errors.store?.name && (
                <Text color="red.300" fontSize="sm" mt={1}>
                  {errors.store.name.message}
                </Text>
              )}
            </FormControl>

            {/* Pagamento e Data */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
              <FormControl isInvalid={!!errors.payment?.name}>
                <FormLabel>Pagamento</FormLabel>
                <AutocompleteInput
                  value={watch('payment.name') || ''}
                  options={payments.map((payment) => payment.name)}
                  onChange={(value) =>
                    setValue('payment.name', value, { shouldValidate: true })
                  }
                  placeholder={t('modals.expense.paymentPlaceholder')}
                />
                {errors.payment?.name && (
                  <Text color="red.300" fontSize="sm" mt={1}>
                    {errors.payment.name.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.date}>
                <FormLabel>Data</FormLabel>
                <Input
                  type="date"
                  {...register('date', {
                    required: t('common.required'),
                  })}
                  {...inputStyle}
                />
                {errors.date && (
                  <Text color="red.300" fontSize="sm" mt={1}>
                    {errors.date.message}
                  </Text>
                )}
              </FormControl>
            </Grid>

            {/* URL da Despesa */}
            <FormControl mb={4}>
              <FormLabel>URL da Despesa</FormLabel>
              <Input
                {...register('uri')}
                {...inputStyle}
                placeholder={t('modals.expense.urlPlaceholder')}
              />
            </FormControl>

            <FormControl mb={4}>
              <Checkbox {...register('repeat')} colorScheme="green" size="lg">
                {t('modals.expense.repeat')}
              </Checkbox>
            </FormControl>

            {/* Seção de Itens */}
            <FormControl isInvalid={!!errors.items}>
              <Flex justify="space-between" align="center" mb={3}>
                <FormLabel mb={0}>{t('modals.expense.items')}</FormLabel>
                <Button
                  size="sm"
                  variant="ghost"
                  color="white"
                  bg="purple.500"
                  _hover={{ bg: 'purple.600' }}
                  onClick={toggleItemsCollapsed}
                  rightIcon={
                    <Icon
                      as={FiChevronDown}
                      transform={isItemsCollapsed ? 'rotate(180deg)' : 'none'}
                      transition="transform 0.2s"
                    />
                  }
                >
                  {isItemsCollapsed ? t('modals.expense.hideItems') : t('modals.expense.showItems')}
                </Button>
              </Flex>

              <Collapse in={isItemsCollapsed} animateOpacity>
                <Box>
                  <Accordion
                    allowToggle
                    index={expandedItemIndex}
                    onChange={(index) => setExpandedItemIndex(index as number)}
                  >
                    {fields.map((field, index) => (
                      <AccordionItem
                        key={field.id}
                        border="1px"
                        borderColor="purple.600"
                        borderRadius="md"
                        mb={3}
                      >
                        <AccordionButton
                          bg="purple.700"
                          _hover={{ bg: 'purple.600' }}
                          _expanded={{ bg: 'purple.600' }}
                          color="white"
                          borderRadius="md"
                        >
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="semibold">
                              Item {index + 1}:{' '}
                              {watch(`items.${index}.name`) || 'Novo item'}
                            </Text>
                            <Text fontSize="sm" color="purple.200">
                              {watch(`items.${index}.value`) || '0,00'} •{' '}
                              {watch(`items.${index}.quantity`) || '1'}{' '}
                              {watch(`items.${index}.unit`) || 'Unidade'}
                            </Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel bg="purple.700" pb={4}>
                          <Flex direction="column" gap={4}>
                            {/* Código e Nome */}
                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                              <FormControl
                                isInvalid={!!errors.items?.[index]?.code}
                              >
                                <FormLabel fontSize="sm">Código</FormLabel>
                                <Input
                                  {...register(`items.${index}.code`, {
                                    required: t('common.required'),
                                    pattern: {
                                      value: /^[a-zA-Z0-9]+$/,
                                      message: t('common.invalidValue'),
                                    },
                                  })}
                                  {...smallInputStyle}
                                  size="sm"
                                />
                                {errors.items?.[index]?.code && (
                                  <Text color="red.300" fontSize="xs" mt={1}>
                                    {errors.items[index]?.code?.message}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl
                                isInvalid={!!errors.items?.[index]?.name}
                              >
                                <FormLabel fontSize="sm">Nome</FormLabel>
                                <Input
                                  {...register(`items.${index}.name`, {
                                    required: t('common.required'),
                                    minLength: {
                                      value: 3,
                                      message: t('common.minLength', { count: 3 }),
                                    },
                                  })}
                                  {...smallInputStyle}
                                  size="sm"
                                />
                                {errors.items?.[index]?.name && (
                                  <Text color="red.300" fontSize="xs" mt={1}>
                                    {errors.items[index]?.name?.message}
                                  </Text>
                                )}
                              </FormControl>
                            </Grid>

                            {/* Quantidade, Unidade e Valor */}
                            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                              <FormControl
                                isInvalid={!!errors.items?.[index]?.quantity}
                              >
                                <FormLabel fontSize="sm">Quantidade</FormLabel>
                                <Input
                                  type="text"
                                  {...register(`items.${index}.quantity`, {
                                    required: t('common.required'),
                                    validate: (value) => {
                                      const numValue = parseGrams(value);
                                      if (isNaN(numValue))
                                        return t('common.invalidValue');
                                      if (numValue <= 0)
                                        return t('common.invalidValue');
                                      return true;
                                    },
                                  })}
                                  onChange={(e) => {
                                    const formatted = formatGramsInput(
                                      e.target.value,
                                    );
                                    setValue(
                                      `items.${index}.quantity`,
                                      formatted,
                                      {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      },
                                    );
                                  }}
                                  {...smallInputStyle}
                                  size="sm"
                                />
                                {errors.items?.[index]?.quantity && (
                                  <Text color="red.300" fontSize="xs" mt={1}>
                                    {errors.items[index]?.quantity?.message}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl
                                isInvalid={!!errors.items?.[index]?.unit}
                              >
                                <FormLabel fontSize="sm">Unidade</FormLabel>
                                <Input
                                  {...register(`items.${index}.unit`, {
                                    required: t('common.required'),
                                  })}
                                  {...smallInputStyle}
                                  size="sm"
                                />
                                {errors.items?.[index]?.unit && (
                                  <Text color="red.300" fontSize="xs" mt={1}>
                                    {errors.items[index]?.unit?.message}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl
                                isInvalid={!!errors.items?.[index]?.value}
                              >
                                <FormLabel fontSize="sm">
                                  Valor Unitário
                                </FormLabel>
                                <Input
                                  type="text"
                                  {...register(`items.${index}.value`, {
                                    required: 'Campo obrigatório',
                                    validate: (value) => {
                                      const numericValue =
                                        parseBRLCurrency(value);
                                      if (isNaN(numericValue))
                                        return t('common.invalidValue');
                                      return (
                                        numericValue >= 0.01 ||
                                        t('common.invalidValue')
                                      );
                                    },
                                  })}
                                  onChange={(e) => {
                                    const formatted = formatCurrencyInputBRL(
                                      e.target.value,
                                    );
                                    setValue(
                                      `items.${index}.value`,
                                      formatted,
                                      {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      },
                                    );
                                  }}
                                  {...smallInputStyle}
                                  size="sm"
                                />
                                {errors.items?.[index]?.value && (
                                  <Text color="red.300" fontSize="xs" mt={1}>
                                    {errors.items[index]?.value?.message}
                                  </Text>
                                )}
                              </FormControl>
                            </Grid>

                            {/* Grupo - Linha separada */}
                            <FormControl
                              isInvalid={!!errors.items?.[index]?.group?.name}
                            >
                              <FormLabel fontSize="sm">Grupo</FormLabel>
                              <AutocompleteInput
                                value={watch(`items.${index}.group.name`) || ''}
                                options={groups.map((group) => group.name)}
                                onChange={(value) =>
                                  setValue(`items.${index}.group.name`, value, {
                                    shouldValidate: true,
                                  })
                                }
                                placeholder="Selecione ou digite um grupo"
                              />
                              {errors.items?.[index]?.group?.name && (
                                <Text color="red.300" fontSize="xs" mt={1}>
                                  {errors.items[index]?.group?.name?.message}
                                </Text>
                              )}
                            </FormControl>

                            {/* Botão Remover */}
                            <Flex justify="flex-end">
                              <Button
                                onClick={() => {
                                  const item = watch(`items.${index}`);
                                  if (item.id && typeof item.id === 'string') {
                                    setRemovedItemIds((prev) => [
                                      ...prev,
                                      item.id as string,
                                    ]);
                                  }
                                  remove(index);
                                }}
                                colorScheme="red"
                                size="sm"
                                isDisabled={fields.length <= 1}
                              >
                                Remover Item
                              </Button>
                            </Flex>
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <Button
                    onClick={handleAddItem}
                    colorScheme="purple"
                    mt={4}
                    w="full"
                    variant="outline"
                    borderColor="purple.500"
                    color="white"
                    _hover={{ bg: 'purple.600' }}
                  >
                    + Adicionar Item
                  </Button>
                </Box>
              </Collapse>
            </FormControl>

            {/* Botão Salvar */}
            <Button
              mt={6}
              colorScheme="purple"
              type="submit"
              w="full"
              size="lg"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              loadingText={t('common.saving')}
            >
              {initialData ? t('common.update') : t('common.save')}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
