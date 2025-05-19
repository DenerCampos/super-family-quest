// src/pages/NotFoundPage/index.tsx
import { Flex, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Flex
      minH="100vh"
      bgImage="url('/assets/images/notfound-bg.png')"
      bgSize="cover"
      bgPosition="center"
      align="center"
      justify="center"
      direction="column"
      gap={4}
      p={4}
    >
      <Flex
        bg="rgba(23, 25, 35, 0.9)"
        p={8}
        borderRadius="xl"
        direction="column"
        align="center"
        textAlign="center"
        backdropFilter="blur(4px)"
      >
        <Heading
          fontSize="6xl"
          color="purple.300"
          fontFamily="Press Start 2P"
          textShadow="2px 2px #000"
        >
          404
        </Heading>

        <Text color="white" mt={4} fontSize="xl">
          🗺️ Página Perdida no Mapa! 🧭
        </Text>

        <Text color="gray.300" mt={2} maxW="400px">
          Você encontrou um caminho secreto... que não existe! Volte para o
          reino principal antes que os slimes financeiros te encontrem!
        </Text>

        <Button
          as={RouterLink}
          to="/home"
          colorScheme="purple"
          mt={6}
          size="lg"
          _hover={{ transform: 'scale(1.05)' }}
          fontFamily="Press Start 2P"
        >
          Voltar para a Segurança
        </Button>
      </Flex>
    </Flex>
  );
};

export default NotFoundPage;
