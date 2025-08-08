import { Box, AbsoluteCenter, Image, Text, keyframes } from '@chakra-ui/react';

// Animação dos pontos
const loadingAnimation = keyframes`
  0% { content: ""; }
  25% { content: "."; }
  50% { content: ".."; }
  75% { content: "..."; }
  100% { content: ""; }
`;

type LoadingState = 'save' | 'loading';

const gifAnimation: Record<LoadingState, string> = {
  save: '/assets/images/knigth-solare.gif',
  loading: '/assets/images/knigth-loading.gif',
};

export const LoadingOverlay = ({ typeLoading = 'save', text = 'Carregando' }: { typeLoading?: LoadingState, text?: string }) => {
  const gifLoading =  gifAnimation[typeLoading];
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.700"
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
            color="white"
            fontSize="lg"
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
