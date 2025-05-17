// src/pages/Login/index.tsx
import { Flex, Input, Button, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  return (
    <Flex
      minH="100vh"
      bgImage="url('/assets/images/login-bg.png')"
      bgSize="cover"
      bgPosition="center"
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
          SUPER FAMILY QUEST
        </Text>

        <Input
          placeholder="Família"
          variant="filled"
          _placeholder={{ color: 'gray.400' }}
          focusBorderColor="purple.400"
        />

        <Input
          type="password"
          placeholder="Senha"
          variant="filled"
          _placeholder={{ color: 'gray.400' }}
          focusBorderColor="purple.400"
        />

        <Button
          colorScheme="purple"
          mt={4}
          _hover={{ transform: 'translateY(-2px)' }}
        >
          Entrar no Reino
        </Button>

        <Button
          as={RouterLink}
          to="/register"
          color="blue.300"
          variant="link"
          mt={2}
          fontSize="sm"
        >
          Criar Novo Reino
        </Button>
      </Flex>
    </Flex>
  );
}


export default Login;