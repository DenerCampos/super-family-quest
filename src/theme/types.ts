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
  gray: {
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
  chakra: {
    blue: string;
    green: string;
    red: string;
    yellow: string;
    purple: string;
    orange: string;
    pink: string;
    gray: string;
    theme: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    write: string;
    hover: string;
    lastRegistrations: {
      expense: string;
      revenue: string;
      neutral: string;
      badge: {
        expense: string;
        revenue: string;
      };
    };
    button: {
      primary: string;
      expense: string;
      revenue: string;
      neutral: string;
      inverted: string;
      hover: {
        primary: string;
        secondary: string;
        tertiary: string;
        expense: string;
        revenue: string;
        neutral: string;
      };
    };
  };
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
    lastRegistrations: {
      expense: string;
      revenue: string;
      neutral: string;
    };
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
    disabled: string;
    link: string;
    highlight: string;
    muted: string;
    inverted: string;
    gold: string;
    silver: string;
    bronze: string;
    copper: string;
    platinum: string;
    diamond: string;
    emerald: string;
    ruby: string;
    sapphire: string;
    amethyst: string;
    default: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  summaryCard: {
    expense: {
      bg: string;
      border: string;
      text: string;
      heading: string;
    };
    revenue: {
      bg: string;
      border: string;
      text: string;
      heading: string;
    };
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
    goldCoin: string;
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