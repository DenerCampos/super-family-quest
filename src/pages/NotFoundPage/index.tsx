// src/pages/NotFoundPage/index.tsx
import { Flex, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

const NotFoundPage = () => {
  const { t } = useThemedTranslation();
  const { getAsset, getColor, getFont } = useVisualTheme();
  return (
    <Flex
      minH="100vh"
      bgImage={`url(${getAsset('images.background.notFound')})`}
      bgSize="cover"
      bgPosition="center"
      align="center"
      justify="center"
      direction="column"
      gap={4}
      p={4}
    >
      <Flex
        bg={getColor('background.login')}
        p={8}
        borderRadius="xl"
        direction="column"
        align="center"
        textAlign="center"
        backdropFilter="blur(4px)"
      >
        <Heading
          fontSize="6xl"
          color={getColor('text.primary')}
          fontFamily={getFont('mono')}
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
          colorScheme={getColor('button.primary')}
          mt={6}
          size="sm"
          _hover={{ transform: 'scale(1.05)' }}
          fontFamily={getFont('mono')}
        >
          {t('notFoundPage.back')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default NotFoundPage;
