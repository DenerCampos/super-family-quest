import { Box, AbsoluteCenter, Image, Text, keyframes } from '@chakra-ui/react';

// Animação dos pontos
const dotsAnimation = keyframes`
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
`;

const gifAnimation = {
  save: '/assets/images/knigth-loading.gif',
  read: '/assets/images/knigth-solare.gif',
  open: '/assets/images/bonfire.gif',
};

export type LoadingState = 'save' | 'read' | 'open';

export const LoadingOverlay = ({ typeLoading = 'save', text = 'Carregando' }: { typeLoading?: LoadingState, text?: string }) => {
  const gifLoading =  gifAnimation[typeLoading];
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="blackAlpha.600"
      backdropFilter="blur(4px)"
      zIndex="overlay"
    >
      <AbsoluteCenter
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Image
          src={gifLoading}
          boxSize="150px"
          alt="Carregando"
          ignoreFallback
        />
        <Text
          fontSize="xl"
          color="white"
          fontFamily="Press Start 2P"
          _after={{
            content: '"..."',
            animation: `${dotsAnimation} 1.5s infinite`,
            display: 'inline-block',
            width: '20px',
            textAlign: 'left',
          }}
        >
          { text }
        </Text>
      </AbsoluteCenter>
    </Box>
  );
};
