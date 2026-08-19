import { useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { getApiErrorCode } from '../../utils/apiError';
import { PasswordInput } from '../PasswordInput';
import {
  buildReactivateSchema,
  type ReactivateFormValues,
} from './reactivateAccountSchema';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
};

export const ReactivateAccountModal = ({ isOpen, onClose, email }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  const schema = useMemo(() => buildReactivateSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReactivateFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { password: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: ReactivateFormValues) => {
    try {
      const { accessToken } = await api.reactivateAccount({
        email,
        password: values.password,
      });
      await establishSession(accessToken);
      toast({
        title: t('common.success'),
        description: t('reactivateAccount.success'),
        status: 'success',
        duration: 3000,
      });
      handleClose();
      navigate('/home', { replace: true });
    } catch (error) {
      const code = getApiErrorCode(error);
      let description = t('reactivateAccount.error');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        description = t('reactivateAccount.invalidPassword');
      } else if (code === 'USER_LIMIT_REACHED') {
        description = t('register.errorCreatingRealmUserLimitUsers');
      }

      toast({
        title: t('reactivateAccount.error'),
        description,
        status: 'error',
        duration: 4000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={getColor('background.login')}>
        <ModalHeader color={getColor('text.primary')}>
          {t('reactivateAccount.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text color={getColor('text.primary')} mb={4} fontSize="sm">
            {t('reactivateAccount.description')}
          </Text>
          <Text color={getColor('text.primary')} mb={2} fontSize="sm" fontWeight="medium">
            {email}
          </Text>
          <FormControl isInvalid={!!errors.password} mb={4}>
            <FormLabel color={getColor('text.primary')}>
              {t('reactivateAccount.password')}
            </FormLabel>
            <PasswordInput
              placeholder={t('reactivateAccount.passwordPlaceholder')}
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
            colorScheme={getColor('button.primary')}
            isLoading={isSubmitting}
            loadingText={t('reactivateAccount.loading')}
          >
            {t('reactivateAccount.submit')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
