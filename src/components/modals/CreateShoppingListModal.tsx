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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { LoadingOverlay } from '../LoadingOverlay';
import type { CreateShoppingListPayload } from '../../types/shoppingList';

interface FamilyGroup {
  id: string;
  name: string;
}

interface CreateShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payload: CreateShoppingListPayload) => Promise<void>;
  familyGroups?: FamilyGroup[];
}

export const CreateShoppingListModal = ({
  isOpen,
  onClose,
  onSuccess,
  familyGroups = [],
}: CreateShoppingListModalProps) => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<{ name: string; familyGroupId: string }>({
    mode: 'onChange',
    defaultValues: { name: '', familyGroupId: '' },
  });

  const onSubmit = async (data: { name: string; familyGroupId: string }) => {
    try {
      const payload: CreateShoppingListPayload = {
        name: data.name,
      };
      if (data.familyGroupId) {
        payload.familyGroupId = data.familyGroupId;
      }
      await onSuccess(payload);
      reset();
      onClose();
    } catch {
      toast({
        title: t('common.error'),
        status: 'error',
        description: t('shoppingList.createModal.createError'),
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
          {t('shoppingList.createModal.title')}
        </ModalHeader>

        <ModalCloseButton color={getColor('text.secondary')} />

        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
              >
                {t('shoppingList.createModal.name')}
              </FormLabel>
              <Input
                {...register('name', {
                  required: t('common.required'),
                  minLength: {
                    value: 3,
                    message: t('common.minLength', { count: 3 }),
                  },
                })}
                bg={getColor('input.background')}
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
                placeholder={t('shoppingList.createModal.namePlaceholder')}
                isDisabled={isSubmitting}
              />
              {errors.name && (
                <Text color={getColor('status.error')} fontSize="sm" mt={1}>
                  {errors.name.message}
                </Text>
              )}
            </FormControl>

            {familyGroups.length > 0 && (
              <FormControl mb={4}>
                <FormLabel
                  color={getColor('text.primary')}
                  fontFamily={getFont('body')}
                >
                  {t('shoppingList.createModal.familyGroup')}
                </FormLabel>
                <Select
                  {...register('familyGroupId')}
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
                  <option value="">
                    {t('shoppingList.createModal.familyGroupNone')}
                  </option>
                  {familyGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

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
              loadingText={t('shoppingList.createModal.creating')}
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
