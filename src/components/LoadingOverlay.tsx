import { Box, AbsoluteCenter, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useVisualTheme } from '../hooks/useVisualTheme';

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
  const { getColor, getFont, getAsset } = useVisualTheme();
  const gifLoading = getAsset(`animations.loading.${typeLoading}`);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={9999}
      borderRadius="md"
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
      </AbsoluteCenter>
    </Box>
  );
};
