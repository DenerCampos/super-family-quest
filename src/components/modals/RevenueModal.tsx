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
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

type RevenueModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  handleNewRegistration?: () => void;
  initialData?: {
    id?: string;
    name: string;
    value: number;
    repeat: boolean;
    date: string;
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
  const { t } = useThemedTranslation();
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
      setValue(
        'date',
          initialData.date.split('T')[0] ||
          new Date().toISOString().split('T')[0],
      );
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

      if (initialData?.id) {
        await api.updateRevenue(initialData.id, payload);
        toast({
          title: t('common.updated'),
          status: 'success',
          duration: 3000,
        });
      } else {
        await api.createRevenue(payload);
        toast({
          title: t('common.created'),
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
        title: t('common.error'),
        description: initialData ? t('common.updateError') : t('common.createError'),
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
          {initialData ? t('modals.revenue.edit') : t('modals.revenue.new')}
        </ModalHeader>

        <ModalCloseButton isDisabled={isSubmitting} />

        <ModalBody pb={4} opacity={isSubmitting ? 0.5 : 1}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel>Nome</FormLabel>
              <Input
                {...register('name', {
                  required: t('common.required'),
                  minLength: {
                    value: 3,
                    message: t('common.minLength', { count: 3 }),
                  },
                })}
                bg="white"
                color="black"
                placeholder={t('modals.revenue.namePlaceholder')}
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
                  required: t('common.required'),
                  validate: (value) => {
                    const numericValue = parseBRLCurrency(value);
                    if (isNaN(numericValue)) return t('common.invalidValue');
                    return (
                      numericValue >= 0.01 || t('common.invalidValue')
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
                placeholder={t('modals.revenue.valuePlaceholder')}
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
                  required: t('common.required'),
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
                {t('modals.revenue.repeat')}
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
                {initialData ? t('common.update') : t('common.save')}
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
