import { extendTheme } from '@chakra-ui/react';

/** Altura aproximada da NavigationBar fixa + margem de respiro. */
export const TOAST_BOTTOM_OFFSET = '72px';

const theme = extendTheme({
  components: {
    Toast: {
      defaultProps: {
        position: 'bottom',
        isClosable: true,
      },
    },
  },
});

export default theme;
