import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Flex, Input, Button, Text, useToast } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const { t } = useThemedTranslation();
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
      bgImage="url('/assets/images/login-bg.png')"
      bgSize="cover"
      bgPosition="center"
      align="center"
      justify="center"
      as="form"
      onSubmit={handleSubmit}
    >
      <Flex
        direction="column"
        bg="rgba(23, 25, 35, 0.8)"
        p={8}
        borderRadius="lg"
        gap={4}
        w="100%"
        maxW="400px"
        backdropFilter="blur(4px)"
      >
        <Text
          fontSize="2xl"
          color="purple.300"
          textAlign="center"
          mb={4}
          fontFamily="Pixelify Sans"
        >
          SUPER FAMILY QUEST
        </Text>

        <Input
          placeholder="Familia (e-mail)"
          value={email}
          variant="filled"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />

        <Input
          type="password"
          placeholder="Senha"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Entrando..."
          colorScheme="purple"
          mt={4}
          _hover={{ transform: 'translateY(-2px)' }}
        >
          {t('login.enter')}
        </Button>

        <Button
          as={RouterLink}
          to="/register"
          color="blue.300"
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

export default Login;
