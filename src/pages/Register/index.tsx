// src/pages/Cadastro/index.tsx
import { Flex, Input, Button, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Register = () => {
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
          fontFamily="Press Start 2P"
        >
          Criar Novo Reino
        </Text>

        <Input placeholder="Nome da Família" variant="filled" />
        <Input placeholder="Senha" type="password" variant="filled" />
        <Input placeholder="Confirmar Senha" type="password" variant="filled" />

        <Button colorScheme="purple" mt={4}>
          Fundar Reino
        </Button>

        <Button
          as={RouterLink}
          to="/login"
          variant="link"
          color="blue.300"
          mt={2}
          fontSize="sm"
        >
          Já tem um reino? Entre aqui
        </Button>
      </Flex>
    </Flex>
  );
}

export default Register;
