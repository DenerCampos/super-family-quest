import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { defaultTheme, rpgTheme } from '../theme/themes';

interface LoginThemeProviderProps {
  children: React.ReactNode;
  themeId: string;
}

export const LoginThemeProvider: React.FC<LoginThemeProviderProps> = ({ children, themeId }) => {
  const themeStyle = themeId === 'rpg' ? rpgTheme : defaultTheme;
  const { colors, fonts } = themeStyle;

  const theme = extendTheme({
    colors,
    fonts,
    styles: {
      global: {
        body: {
          bg: colors.background.primary,
          color: colors.text.primary,
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
};
