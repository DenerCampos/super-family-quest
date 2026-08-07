import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { api } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useLoginTheme } from '../../hooks/useLoginTheme';
import { LoginThemeProvider } from '../../components/LoginThemeProvider';

const DemoLoginContent = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const loginTheme = useLoginTheme();
  const { getColor, getAsset } = useVisualTheme(loginTheme);
  const { t } = useThemedTranslation();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const expectedKey = import.meta.env.VITE_DEMO_KEY as string | undefined;

    if (!expectedKey || !key || key !== expectedKey) {
      navigate('/login', { replace: true });
      return;
    }

    api
      .demoLogin(key)
      .then(({ accessToken }) => establishSession(accessToken))
      .then(() => {
        navigate('/home', { replace: true });
      })
      .catch(() => {
        navigate('/login', { replace: true });
      });
  }, [key, navigate, establishSession]);

  return (
    <Flex
      minH="100vh"
      bgImage={`url(${getAsset('images.background.login')})`}
      bgSize="cover"
      bgPosition="center"
      align="center"
      justify="center"
      direction="column"
      gap={4}
    >
      <Spinner
        size="xl"
        color={getColor('button.background.primary')}
        thickness="4px"
        aria-label={t('demoLogin.loading')}
      />
      <Text
        color={getColor('text.primary')}
        fontSize="sm"
      >
        {t('demoLogin.loading')}
      </Text>
    </Flex>
  );
};

const DemoLogin = () => {
  const loginTheme = useLoginTheme();

  return (
    <LoginThemeProvider themeId={loginTheme}>
      <DemoLoginContent />
    </LoginThemeProvider>
  );
};

export default DemoLogin;
