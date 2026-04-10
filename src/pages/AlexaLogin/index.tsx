import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flex, Input, Button, Text, useToast, Box, Icon } from '@chakra-ui/react';
import { FiMic } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useLoginTheme } from '../../hooks/useLoginTheme';
import { LoginThemeProvider } from '../../components/LoginThemeProvider';
import { api } from '../../services';

const AlexaLoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const sessionCode = searchParams.get('session_code') ?? '';

  const toast = useToast();
  const { t } = useThemedTranslation();
  const loginTheme = useLoginTheme();
  const { getColor, getFont, getAsset } = useVisualTheme(loginTheme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionCode) {
      toast({
        title: t('alexaLogin.invalidSession'),
        description: t('alexaLogin.invalidSessionDescription'),
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { redirectUrl } = await api.alexaOAuthLogin(email, password, sessionCode);
      window.location.href = redirectUrl;
    } catch {
      toast({
        title: t('alexaLogin.error'),
        description: t('alexaLogin.errorDescription'),
        status: 'error',
        duration: 4000,
        isClosable: true,
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
        <Flex direction="column" align="center" gap={2} mb={2}>
          <Box
            bg={getColor('button.background.primary')}
            borderRadius="full"
            p={3}
          >
            <Icon as={FiMic} color={getColor('button.text.primary')} boxSize={6} />
          </Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={getColor('text.primary')}
            textAlign="center"
            fontFamily={getFont('theme')}
          >
            {t('alexaLogin.title')}
          </Text>
          <Text
            fontSize="sm"
            color={getColor('text.secondary')}
            textAlign="center"
            fontFamily={getFont('body')}
          >
            {t('alexaLogin.subtitle')}
          </Text>
        </Flex>

        <Input
          placeholder={t('alexaLogin.email')}
          value={email}
          variant="filled"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          color={getColor('text.primary')}
          _hover={{ bg: getColor('input.hover'), borderColor: getColor('input.focusBorder') }}
          _focus={{ bg: getColor('input.focus'), borderColor: getColor('input.focusBorder') }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />

        <Input
          type="password"
          placeholder={t('alexaLogin.password')}
          variant="filled"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          color={getColor('text.primary')}
          _hover={{ bg: getColor('input.hover') }}
          _focus={{ bg: getColor('input.focus') }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText={t('alexaLogin.loading')}
          bg={getColor('button.background.primary')}
          color={getColor('button.text.primary')}
          mt={2}
          _hover={{ opacity: 0.85 }}
        >
          {t('alexaLogin.submit')}
        </Button>
      </Flex>
    </Flex>
  );
};

const AlexaLogin = () => {
  const loginTheme = useLoginTheme();

  return (
    <LoginThemeProvider themeId={loginTheme}>
      <AlexaLoginContent />
    </LoginThemeProvider>
  );
};

export default AlexaLogin;
