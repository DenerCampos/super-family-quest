// src/pages/Cadastro/index.tsx
import { useState } from 'react';
import { Flex, Input, Button, Text, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { api } from '../../services';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (!email || email.length < 3) {
      toast({
        title: 'Erro',
        description: 'Nome da família deve ter pelo menos 3 caracteres',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.register({
        name,
        email,
        password,
      });

      toast({
        title: 'Reino Fundado!',
        description: 'Seu reino foi criado com sucesso',
        status: 'success',
        duration: 3000,
      });

      navigate('/login');
    } catch (error: any) {
      console.error(error);

      let errorMessage = 'Erro ao criar reino';
      
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.status === 400) {
        errorMessage = 'Falha ao criar o reuino, usuário já existe';
      }

      toast({
        title: 'Erro',
        description: errorMessage,
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
      bgImage="url('/assets/images/register-bg.png')"
      bgSize="cover"
      align="center"
      justify="center"
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
          Criar Novo Reino
        </Text>

        <Input
          placeholder="Nome completo"
          variant="filled"
          focusBorderColor="purple.500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isDisabled={isLoading}
        />
        <Input
          placeholder="E-mail"
          type="email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isDisabled={isLoading}
        />
        <Input
          placeholder="Senha"
          type="password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={isLoading}
        />
        <Input
          placeholder="Confirmar Senha"
          type="password"
          variant="filled"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isDisabled={isLoading}
        />

        <Button
          colorScheme="purple"
          mt={4}
          onClick={handleRegister}
          isLoading={isLoading}
          loadingText="Fundando..."
          isDisabled={isLoading}
        >
          Criar reino
        </Button>

        <Button
          as={RouterLink}
          to="/login"
          variant="link"
          color="blue.300"
          mt={2}
          fontSize="sm"
          isDisabled={isLoading}
        >
          Já tem um reino? Entre aqui
        </Button>
      </Flex>
    </Flex>
  );
};

export default Register;
