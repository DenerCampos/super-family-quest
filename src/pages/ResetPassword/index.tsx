import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useLoginTheme } from '../../hooks/useLoginTheme';
import { LoginThemeProvider } from '../../components/LoginThemeProvider';
import { PasswordInput } from '../../components/PasswordInput';
import { getApiErrorCode } from '../../utils/apiError';
import { buildResetPasswordSchema, type ResetPasswordFormValues } from './schema';
import { useAuth } from '../../contexts/AuthContext';

type ResetStatus = 'form' | 'invalid';

function readResetTokenFromState(state: unknown): string {
  if (typeof state !== 'object' || state === null) {
    return '';
  }

  const token = Reflect.get(state, 'token');
  return typeof token === 'string' ? token.trim() : '';
}

const ResetPasswordContent = () => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const loginTheme = useLoginTheme();
  const { getColor, getFont, getAsset } = useVisualTheme(loginTheme);
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token')?.trim() ?? '';
  const token = readResetTokenFromState(location.state) || queryToken;
  const [status, setStatus] = useState<ResetStatus>(token ? 'form' : 'invalid');

  useEffect(() => {
    if (!queryToken) {
      return;
    }

    navigate('/reset-password', {
      replace: true,
      state: { token: queryToken },
    });
  }, [navigate, queryToken]);

  const schema = useMemo(() => buildResetPasswordSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
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

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const { accessToken } = await api.resetPassword({
        token,
        password: values.password,
      });

      try {
        if (!accessToken) {
          throw new Error('missing_access_token');
        }
        await establishSession(accessToken);
      } catch {
        toast({
          title: t('passwordReset.successTitle'),
          description: t('passwordReset.successDescription'),
          status: 'warning',
          duration: 4000,
        });
        navigate('/login', { replace: true });
        return;
      }

      toast({
        title: t('passwordReset.successTitle'),
        description: t('passwordReset.successLoggedIn'),
        status: 'success',
        duration: 3000,
      });
      navigate('/home', { replace: true });
    } catch (error: unknown) {
      const code = getApiErrorCode(error);
      if (code === 'INVALID_OR_EXPIRED_RESET_TOKEN') {
        setStatus('invalid');
        return;
      }

      toast({
        title: t('common.error'),
        description:
          code === 'USER_LIMIT_REACHED'
            ? t('register.errorCreatingRealmUserLimitUsers')
            : t('passwordReset.genericError'),
        status: code === 'USER_LIMIT_REACHED' ? 'info' : 'error',
        duration: 4000,
      });
    }
  };

  const heading = {
    form: t('passwordReset.resetTitle'),
    invalid: t('passwordReset.invalidTokenTitle'),
  }[status];

  const description = {
    form: t('passwordReset.resetDescription'),
    invalid: t('passwordReset.invalidTokenDescription'),
  }[status];

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
          fontFamily={getFont('theme')}
        >
          {heading}
        </Text>

        <Text fontSize="sm" color={getColor('text.primary')} textAlign="center">
          {description}
        </Text>

        {status === 'form' && (
          <>
            <FormControl isInvalid={!!errors.password} mt={2}>
              <PasswordInput
                placeholder={t('passwordReset.newPassword')}
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
                placeholder={t('passwordReset.confirmPassword')}
                variant="filled"
                autoComplete="new-password"
                isDisabled={isSubmitting}
                {...register('confirmPassword')}
                {...inputStyles}
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText={t('passwordReset.saving')}
              colorScheme={getColor('button.primary')}
              mt={2}
            >
              {t('passwordReset.confirm')}
            </Button>
          </>
        )}

        {status === 'invalid' && (
          <Button
            as={RouterLink}
            to="/forgot-password"
            colorScheme={getColor('button.primary')}
            mt={2}
          >
            {t('passwordReset.requestNewLink')}
          </Button>
        )}

        <Button
          as={RouterLink}
          to="/login"
          color={getColor('link.primary')}
          variant="link"
          mt={2}
          fontSize="sm"
        >
          {t('passwordReset.backToLogin')}
        </Button>
      </Flex>
    </Flex>
  );
};

const ResetPassword = () => {
  const loginTheme = useLoginTheme();

  return (
    <LoginThemeProvider themeId={loginTheme}>
      <ResetPasswordContent />
    </LoginThemeProvider>
  );
};

export default ResetPassword;
