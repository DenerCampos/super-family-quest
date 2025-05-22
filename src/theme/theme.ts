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
  },
});

export default theme;
