import { useState } from 'react';
import {
  Button,
  Flex,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useLoginTheme } from '../../hooks/useLoginTheme';
import { LoginThemeProvider } from '../../components/LoginThemeProvider';
import { getApiErrorStatus } from '../../utils/apiError';

function readEmailFromState(state: unknown): string {
  if (typeof state !== 'object' || state === null) {
    return '';
  }

  const email = Reflect.get(state, 'email');
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

const RecoverAccountContent = () => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const loginTheme = useLoginTheme();
  const { getColor, getFont, getAsset } = useVisualTheme(loginTheme);
  const location = useLocation();
  const email = readEmailFromState(location.state);
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRecover = async () => {
    if (!email) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.recoverAccount(email);
      setIsSent(true);
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      if (status !== null && status >= 400 && status < 500 && status !== 429) {
        setIsSent(true);
        return;
      }

      toast({
        title: t('common.error'),
        description: t('recoverAccount.genericError'),
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
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
            ? t('recoverAccount.sentTitle')
            : t('recoverAccount.title')}
        </Text>

        <Text fontSize="sm" color={getColor('text.primary')} textAlign="center">
          {isSent
            ? t('recoverAccount.sentDescription')
            : email
              ? t('recoverAccount.description')
              : t('recoverAccount.missingEmail')}
        </Text>

        {!isSent && email && (
          <>
            <Text
              fontSize="md"
              fontWeight="medium"
              color={getColor('text.primary')}
              textAlign="center"
              wordBreak="break-all"
            >
              {email}
            </Text>

            <Button
              onClick={() => {
                void onRecover();
              }}
              isLoading={isSubmitting}
              loadingText={t('recoverAccount.sending')}
              colorScheme={getColor('button.primary')}
              mt={2}
            >
              {t('recoverAccount.submit')}
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

const RecoverAccount = () => {
  const loginTheme = useLoginTheme();

  return (
    <LoginThemeProvider themeId={loginTheme}>
      <RecoverAccountContent />
    </LoginThemeProvider>
  );
};

export default RecoverAccount;
