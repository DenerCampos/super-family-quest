import { Box, AbsoluteCenter, Image, Text, keyframes } from '@chakra-ui/react';
import { useVisualTheme } from '../hooks/useVisualTheme';

// Animação dos pontos
const loadingAnimation = keyframes`
  0% { content: ""; }
  25% { content: "."; }
  50% { content: ".."; }
  75% { content: "..."; }
  100% { content: ""; }
`;

type LoadingState = 'save' | 'loading';

export const LoadingOverlay = ({ typeLoading = 'save', text = 'Carregando' }: { typeLoading?: LoadingState, text?: string }) => {
  const { getColor, getFont, getAsset } = useVisualTheme();
  const gifLoading = getAsset(`animations.loading.${typeLoading}`);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={getColor('background.primary')}
      opacity={0.9}
      zIndex={9999}
      borderRadius="md"
    >
      <AbsoluteCenter>
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
            fontSize="lg"
            fontFamily={getFont('heading')}
            _after={{
              content: '""',
              animation: `${loadingAnimation} 1s infinite`,
            }}
          >
            {text}
          </Text>
        </Box>
      </AbsoluteCenter>
    </Box>
  );
};
