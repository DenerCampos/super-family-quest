import type { ThemeNamespace } from '../i18n/types';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
}

export interface ThemeFonts {
  body: string;
  heading: string;
  mono: string;
}

export interface ThemeAssets {
  images: {
    logo: string;
    background: {
      login: string;
      register: string;
      notFound: string;
      underConstruction: string;
    };
    coatOfArms: {
      family: string;
      solare: string;
    };
  };
  animations: {
    loading: {
      save: string;
      read: string;
      open: string;
    };
  };
}

export interface VisualTheme {
  id: ThemeNamespace;
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  assets: ThemeAssets;
} 