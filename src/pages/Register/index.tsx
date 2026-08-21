import { useMemo } from 'react';
import {
  Flex,
  Input,
  Button,
  Text,
  useToast,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useAuth } from '../../contexts/AuthContext';
import { PasswordInput } from '../../components/PasswordInput';
import { buildRegisterSchema, type RegisterFormValues } from './schema';
import { getApiErrorCode } from '../../utils/apiError';

const Register = () => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { getAsset, getColor, getFont } = useVisualTheme();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // O convite para quem ainda não tem conta chega como /register?email=...
  const invitedEmail = searchParams.get('email')?.trim().toLowerCase() ?? '';

  const schema = useMemo(() => buildRegisterSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: invitedEmail,
      password: '',
      confirmPassword: '',
    },
  });

  const inputStyles = {
    color: getColor('text.primary'),
    _hover: {
      bg: getColor('input.hover'),
      borderColor: getColor('input.focusBorder'),
    },
    _focus: {
      bg: getColor('input.focus'),
      borderColor: getColor('input.focusBorder'),
    },
    borderColor: getColor('input.border'),
    bg: getColor('input.background'),
  };

  const onSubmit = async (values: RegisterFormValues) => {
    const email = values.email.trim().toLowerCase();

    try {
      const userData = await api.register({
        name: values.name.trim(),
        email,
        password: values.password,
      });

      if (!userData) {
        throw new Error(t('register.errorCreatingRealm'));
      }

      toast({
        title: t('register.realmCreated'),
        description: t('register.realmCreatedSuccessfully'),
        status: 'success',
        duration: 3000,
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      await login(email, values.password);
    } catch (error: unknown) {
      const code = getApiErrorCode(error);

      if (code === 'ACCOUNT_DELETED_REACTIVATION_REQUIRED') {
        navigate('/recover-account', { state: { email } });
        return;
      }

      if (code === 'USER_LIMIT_REACHED') {
        toast({
          title: t('common.information'),
          description: t('register.errorCreatingRealmUserLimitUsers'),
          status: 'info',
          duration: 12000,
          isClosable: true,
        });
        return;
      }

      const errorMessage =
        code === 'EMAIL_ALREADY_EXISTS'
          ? t('register.errorCreatingRealmUserAlreadyExists')
          : t('register.errorCreatingRealm');

      toast({
        title: t('register.error'),
        description: errorMessage,
        status: 'error',
        duration: 4000,
      });
    }
  };

  return (
    <Flex
        minH="100vh"
        bgImage={`url(${getAsset('images.background.register')})`}
        bgSize="cover"
        align="center"
        justify="center"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Flex
          direction="column"
          bg={getColor('background.login')}
          p={8}
          borderRadius="lg"
          gap={4}
          w="100%"
          maxW="400px"
          backdropFilter="blur(4px)"
        >
          <Text
            fontSize="2xl"
            color={getColor('text.primary')}
            textAlign="center"
            mb={4}
            fontFamily={getFont('theme')}
          >
            {t('register.createNewRealm')}
          </Text>

          <FormControl isInvalid={!!errors.name}>
            <Input
              placeholder={t('register.fullName')}
              variant="filled"
              autoComplete="name"
              isDisabled={isSubmitting}
              {...register('name')}
              {...inputStyles}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <Input
              placeholder={t('register.email')}
              type="email"
              variant="filled"
              autoComplete="email"
              isDisabled={isSubmitting}
              {...register('email')}
              {...inputStyles}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <PasswordInput
              placeholder={t('register.password')}
              variant="filled"
              autoComplete="new-password"
              isDisabled={isSubmitting}
              {...register('password')}
              {...inputStyles}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword}>
            <PasswordInput
              placeholder={t('register.confirmPassword')}
              variant="filled"
              autoComplete="new-password"
              isDisabled={isSubmitting}
              {...register('confirmPassword')}
              {...inputStyles}
            />
            <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme={getColor('button.primary')}
            mt={4}
            isLoading={isSubmitting}
            loadingText={t('register.funding')}
            isDisabled={isSubmitting}
          >
            {t('register.createRealm')}
          </Button>

          <Button
            as={RouterLink}
            to="/login"
            variant="link"
            color={getColor('link.primary')}
            mt={2}
            fontSize="sm"
            isDisabled={isSubmitting}
          >
            {t('register.alreadyHaveRealm')}
          </Button>
        </Flex>
      </Flex>
  );
};

export default Register;
