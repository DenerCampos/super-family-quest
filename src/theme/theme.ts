import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Press Start 2P", cursive',
    // body: '"Pixelify Sans", sans-serif',
  },
  colors: {
    retro: {
      dark: '#2d1b42',
      purple: '#8b5fbf',
      pink: '#e394ff',
      yellow: '#ffd700',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 0,
        border: '2px solid',
        _hover: { transform: 'scale(1.02)' },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
        },
      },
    },
    List: {
      baseStyle: {
        container: {
          zIndex: 9999,
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.700', // Fundo mais escuro no estado normal
            color: 'white', // Texto branco para melhor contraste
            _hover: {
              bg: 'gray.600', // Efeito hover sutil
            },
            _focus: {
              bg: 'white', // Fundo branco quando em foco
              color: 'black', // Texto preto quando em foco
              borderColor: 'purple.500',
            },
            _placeholder: {
              color: 'gray.400', // Placeholder visível
            },
          },
        },
      },
    },
  },
});

export default theme;
