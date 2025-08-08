// src/pages/NotFoundPage/index.tsx
import { Flex, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

const NotFoundPage = () => {
  const { t } = useThemedTranslation();
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
          🗺️ {t('notFoundPage.lost')} 🧭
        </Text>

        <Text color="gray.300" mt={2} maxW="400px">
          {t('notFoundPage.secretPath')}
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
          {t('notFoundPage.back')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default NotFoundPage;
