import { useMemo } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { getApiErrorCode } from '../../utils/apiError';
import { PasswordInput } from '../PasswordInput';

type DeleteAccountFormValues = {
  password: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

export const DeleteAccountModal = ({ isOpen, onClose, userId }: Props) => {
  const toast = useToast();
  const { logout } = useAuth();
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  const schema = useMemo(
    () =>
      yup.object({
        password: yup
          .string()
          .required(t('profile.deleteAccount.passwordRequired'))
          .max(64, t('profile.deleteAccount.passwordMaxLength')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeleteAccountFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { password: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: DeleteAccountFormValues) => {
    try {
      await api.deleteAccount({ id: userId, password: values.password });
      toast({
        title: t('profile.deleteAccount.successTitle'),
        description: t('profile.deleteAccount.successDescription'),
        status: 'success',
        duration: 4000,
      });
      handleClose();
      logout();
    } catch (error: unknown) {
      const code = getApiErrorCode(error);
      let description = t('profile.deleteAccount.error');

      if (code === 'INVALID_PASSWORD') {
        description = t('profile.deleteAccount.invalidPassword');
      } else if (code === 'LAST_FAMILY_GROUP_ADMIN') {
        description = t('profile.deleteAccount.lastAdmin');
      }

      toast({
        title: t('profile.deleteAccount.errorTitle'),
        description,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={getColor('background.login')}>
        <ModalHeader color={getColor('text.primary')}>
          {t('profile.deleteAccount.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text color={getColor('text.primary')} mb={4} fontSize="sm">
            {t('profile.deleteAccount.description')}
          </Text>
          <FormControl isInvalid={!!errors.password} mb={4}>
            <FormLabel color={getColor('text.primary')}>
              {t('profile.deleteAccount.password')}
            </FormLabel>
            <PasswordInput
              placeholder={t('profile.deleteAccount.passwordPlaceholder')}
              autoComplete="current-password"
              {...register('password')}
              color={getColor('text.primary')}
              bg={getColor('input.background')}
              borderColor={getColor('input.border')}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            w="100%"
            colorScheme={getColor('button.danger')}
            isLoading={isSubmitting}
            loadingText={t('profile.deleteAccount.deleting')}
          >
            {t('profile.deleteAccount.confirm')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
