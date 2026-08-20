import { useMemo, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useLoginTheme } from '../../hooks/useLoginTheme';
import { LoginThemeProvider } from '../../components/LoginThemeProvider';
import { getApiErrorStatus } from '../../utils/apiError';
import {
  buildForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from './schema';

const ForgotPasswordContent = () => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const loginTheme = useLoginTheme();
  const { getColor, getFont, getAsset } = useVisualTheme(loginTheme);
  const [isSent, setIsSent] = useState(false);

  const schema = useMemo(() => buildForgotPasswordSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
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

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await api.forgotPassword(values.email.trim().toLowerCase());
      setIsSent(true);
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      // 4xx (exceto 429) não pode virar oráculo se a API divergir do contrato.
      if (status !== null && status >= 400 && status < 500 && status !== 429) {
        setIsSent(true);
        return;
      }

      toast({
        title: t('common.error'),
        description: t('passwordReset.genericError'),
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
          fontFamily={getFont('theme')}
        >
          {isSent
            ? t('passwordReset.sentTitle')
            : t('passwordReset.forgotTitle')}
        </Text>

        <Text fontSize="sm" color={getColor('text.primary')} textAlign="center">
          {isSent
            ? t('passwordReset.sentDescription')
            : t('passwordReset.forgotDescription')}
        </Text>

        {!isSent && (
          <>
            <FormControl isInvalid={!!errors.email} mt={2}>
              <Input
                placeholder={t('passwordReset.emailPlaceholder')}
                variant="filled"
                type="email"
                autoComplete="email"
                isDisabled={isSubmitting}
                {...register('email')}
                {...inputStyles}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText={t('passwordReset.sending')}
              colorScheme={getColor('button.primary')}
              mt={2}
            >
              {t('passwordReset.sendLink')}
            </Button>
          </>
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

const ForgotPassword = () => {
  const loginTheme = useLoginTheme();

  return (
    <LoginThemeProvider themeId={loginTheme}>
      <ForgotPasswordContent />
    </LoginThemeProvider>
  );
};

export default ForgotPassword;
