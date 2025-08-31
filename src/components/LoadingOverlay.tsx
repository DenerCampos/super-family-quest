import { Box, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { useInitialTheme } from '../hooks/useInitialTheme';

// Animação dos pontos
const loadingAnimation = keyframes`
  0% { content: ""; }
  25% { content: "."; }
  50% { content: ".."; }
  75% { content: "..."; }
  100% { content: ""; }
`;

type LoadingState = 'save' | 'loading' | 'open' | 'read';

export const LoadingOverlay = ({ typeLoading = 'save', text = 'Carregando' }: { typeLoading?: LoadingState, text?: string }) => {
  const initialTheme = useInitialTheme();
  const { getColor, getFont, getAsset } = useVisualTheme(initialTheme);
  const gifLoading = getAsset(`animations.loading.${typeLoading}`);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      width="100vw"
      height="100vh"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: getColor('background.loading'),
        opacity: 0.8,
        borderRadius: 'md',
        zIndex: -1,
      }}
    >
      <Box textAlign="center">
        <Image
          src={gifLoading}
          alt="Loading"
          boxSize="100px"
          mx="auto"
          mb={4}
        />
        <Text
          color={getColor('text.primary')}
          fontSize="xl"
          fontWeight="bold"
          fontFamily={getFont('heading')}
          _after={{
            content: '""',
            animation: `${loadingAnimation} 1s infinite`,
            color: getColor('text.primary'),
          }}
        >
          {text}
        </Text>
      </Box>
    </Box>
  );
};
