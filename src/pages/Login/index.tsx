import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Flex, Input, Button, Text, useToast } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useLoginTheme } from '../../hooks/useLoginTheme';
import { LoginThemeProvider } from '../../components/LoginThemeProvider';

const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const loginTheme = useLoginTheme();
  const { getColor, getFont, getAsset } = useVisualTheme(loginTheme);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      
      toast({
        title: t('login.error'),
        description: t('login.invalidCredentials'),
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
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
      onSubmit={handleSubmit}
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
          SUPER FAMILY QUEST
        </Text>

        <Input
          placeholder="Familia (e-mail)"
          value={email}
          variant="filled"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          color={getColor('text.primary')}
          _hover={{
            bg: getColor('input.hover'),
            borderColor: getColor('input.focusBorder'),
          }}
          _focus={{
            bg: getColor('input.focus'),
            borderColor: getColor('input.focusBorder'),
          }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />

        <Input
          type="password"
          placeholder="Senha"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          color={getColor('text.primary')}
          _hover={{
            bg: getColor('input.hover'),
          }}
          _focus={{
            bg: getColor('input.focus'),
          }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Entrando..."
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
