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
  Button,
  useToast,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { LoadingOverlay } from '../LoadingOverlay';
import { UNIT_OPTIONS } from '../../types/shoppingList';
import type {
  ShoppingListItemResponse,
  UpdateShoppingListItemPayload,
  ShoppingListItemUnit,
} from '../../types/shoppingList';

interface EditShoppingListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingListItemResponse | null;
  onSave: (
    itemId: string,
    payload: UpdateShoppingListItemPayload,
  ) => Promise<void>;
}

interface FormData {
  name: string;
  quantity: number;
  unit: ShoppingListItemUnit;
}

export const EditShoppingListItemModal = ({
  isOpen,
  onClose,
  item,
  onSave,
}: EditShoppingListItemModalProps) => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      quantity: 1,
      unit: 'un',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: FormData) => {
    if (!item) return;
    try {
      await onSave(item.id, {
        name: data.name,
        quantity: Number(data.quantity),
        unit: data.unit,
      });
      onClose();
    } catch {
      toast({
        title: t('common.error'),
        status: 'error',
        description: t('shoppingList.item.editError'),
        duration: 3000,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      closeOnOverlayClick={!isSubmitting}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent
        bg={getColor('background.primary')}
        color={getColor('text.primary')}
      >
        {isSubmitting && <LoadingOverlay />}

        <ModalHeader fontFamily={getFont('heading')}>
          {t('shoppingList.item.edit')}
        </ModalHeader>

        <ModalCloseButton color={getColor('text.secondary')} />

        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
              >
                {t('shoppingList.item.name')}
              </FormLabel>
              <Input
                {...register('name', {
                  required: t('common.required'),
                  minLength: {
                    value: 2,
                    message: t('common.minLength', { count: 2 }),
                  },
                })}
                bg={getColor('input.background')}
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
                placeholder={t('shoppingList.item.namePlaceholder')}
                isDisabled={isSubmitting}
              />
              {errors.name && (
                <Text color={getColor('status.error')} fontSize="sm" mt={1}>
                  {errors.name.message}
                </Text>
              )}
            </FormControl>

            <Flex gap={3} mb={4}>
              <FormControl isInvalid={!!errors.quantity} flex={1}>
                <FormLabel
                  color={getColor('text.primary')}
                  fontFamily={getFont('body')}
                >
                  {t('shoppingList.item.quantity')}
                </FormLabel>
                <Input
                  {...register('quantity', {
                    required: t('common.required'),
                    min: { value: 0.01, message: t('common.invalidValue') },
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="0.01"
                  bg={getColor('input.background')}
                  color={getColor('text.primary')}
                  fontFamily={getFont('body')}
                  isDisabled={isSubmitting}
                />
                {errors.quantity && (
                  <Text color={getColor('status.error')} fontSize="sm" mt={1}>
                    {errors.quantity.message}
                  </Text>
                )}
              </FormControl>

              <FormControl flex={1}>
                <FormLabel
                  color={getColor('text.primary')}
                  fontFamily={getFont('body')}
                >
                  {t('shoppingList.item.unit')}
                </FormLabel>
                <Select
                  {...register('unit')}
                  bg={getColor('input.background')}
                  color={getColor('text.primary')}
                  fontFamily={getFont('body')}
                  isDisabled={isSubmitting}
                  sx={{
                    option: {
                      bg: 'white',
                      color: 'gray.800',
                    },
                  }}
                >
                  {UNIT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <Button
              mt={2}
              bg={getColor('background.tertiary')}
              color={getColor('text.primary')}
              border="1px solid"
              borderColor={getColor('border.primary')}
              _hover={{
                bg: getColor('background.selected'),
                color: getColor('text.accent'),
              }}
              type="submit"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              loadingText={t('common.saving')}
              w="full"
              fontFamily={getFont('body')}
            >
              {t('common.save')}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
