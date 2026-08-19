import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Flex,
  Input,
  Button,
  Text,
  useToast,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useLoginTheme } from '../../hooks/useLoginTheme';
import { LoginThemeProvider } from '../../components/LoginThemeProvider';
import { PasswordInput } from '../../components/PasswordInput';
import { buildLoginSchema, type LoginFormValues } from './schema';

const LoginContent = () => {
  const { login } = useAuth();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const loginTheme = useLoginTheme();
  const { getColor, getFont, getAsset } = useVisualTheme(loginTheme);

  const schema = useMemo(() => buildLoginSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
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

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const email = values.email.trim().toLowerCase();
      await login(email, values.password);
    } catch {
      toast({
        title: t('login.error'),
        description: t('login.invalidCredentials'),
        status: 'error',
        duration: 4000,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      bgImage={`url(${getAsset('images.background.login')})`}
      bgSize="cover"
      bgPosition="center"
      align="center"
      justify="center"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Flex
        direction="column"
        p={8}
        borderRadius="lg"
        gap={4}
        w="100%"
        maxW="400px"
        backdropFilter="blur(4px)"
        bg={getColor('background.login')}
      >
        <Text
          fontSize="2xl"
          color={getColor('text.primary')}
          textAlign="center"
          mb={4}
          fontFamily={getFont('theme')}
        >
          {t('login.title')}
        </Text>

        <FormControl isInvalid={!!errors.email}>
          <Input
            placeholder={t('login.emailPlaceholder')}
            variant="filled"
            type="email"
            autoComplete="email"
            {...register('email')}
            {...inputStyles}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <PasswordInput
            placeholder={t('login.passwordPlaceholder')}
            variant="filled"
            autoComplete="current-password"
            {...register('password')}
            {...inputStyles}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText={t('login.loading')}
          colorScheme={getColor('button.primary')}
          mt={4}
        >
          {t('login.enter')}
        </Button>

        <Button
          as={RouterLink}
          to="/register"
          color={getColor('link.primary')}
          variant="link"
          mt={2}
          fontSize="sm"
        >
          {t('login.create')}
        </Button>
      </Flex>
    </Flex>
  );
};

const Login = () => {
  const loginTheme = useLoginTheme();

  return (
    <LoginThemeProvider themeId={loginTheme}>
      <LoginContent />
    </LoginThemeProvider>
  );
};

export default Login;
