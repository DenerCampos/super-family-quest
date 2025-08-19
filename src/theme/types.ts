import type { ThemeNamespace } from '../i18n/types';

// Interface para as cores do Chakra (50-950)
interface ColorScale {
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
  950: string;
}

// Interface para tokens que têm variantes light/dark
interface ThemeToken {
  light: string;
  dark: string;
}

export interface ThemeColors {
  // Cores principais do tema
  primary: string;
  secondary: string;
  accent: string;
  gray: string;
  revenue: string;
  expense: string;

  chakraColors: {
    red: string;
    green: string;
    yellow: string;
    purple: string;
    blue: string;
    cyan: string;
    pink: string;
    orange: string;
    teal: string;
    gray: string;
    white: string;
    black: string;
  };

  // Tokens semânticos para background
  background: {
    primary: ThemeToken;
    secondary: ThemeToken;
    tertiary: ThemeToken;
    quaternary: ThemeToken;
    selected: ThemeToken;
    noSelect: ThemeToken;
    write: ThemeToken;
    hover: ThemeToken;
    lastRegistrations: {
      expense: ThemeToken;
      revenue: ThemeToken;
      neutral: ThemeToken;
    };
    loading: ThemeToken;
    summaryCard: {
      revenue: ThemeToken;
      expense: ThemeToken;
    };
    login: ThemeToken;
  };

  // Tokens semânticos para texto
  text: {
    primary: ThemeToken;
    secondary: ThemeToken;
    tertiary: ThemeToken;
    accent: ThemeToken;
    disabled: ThemeToken;
    link: ThemeToken;
    gold: ThemeToken;
    summaryCard: {
      revenue: ThemeToken;
      expense: ThemeToken;
    };
    lastRegistrations: {
      expense: ThemeToken;
      revenue: ThemeToken;
    };
  };

  // Tokens semânticos para heading
  heading: {
    summaryCard: {
      revenue: ThemeToken;
      expense: ThemeToken;
    };
  };

  // Tokens semânticos para bordas
  border: {
    primary: ThemeToken;
    secondary: ThemeToken;
    selected: ThemeToken;
    noSelect: ThemeToken;
    lastRegistrations: {
      expense: ThemeToken;
      revenue: ThemeToken;
      neutral: ThemeToken;
    };
    summaryCard: {
      revenue: ThemeToken;
      expense: ThemeToken;
    };
  };

  // Tokens semânticos para status
  status: {
    success: ThemeToken;
    error: ThemeToken;
    warning: ThemeToken;
    info: ThemeToken;
  };

  // Configuração de botões usando cores do Chakra
  button: {
    primary: ThemeToken;
    secondary: ThemeToken;
    danger: ThemeToken;
    warning: ThemeToken;
  };

  link: {
    primary: ThemeToken;
  };

  input: {
    primary: ThemeToken;
    secondary: ThemeToken;
    hover: ThemeToken;
    focus: ThemeToken;
    border: ThemeToken;
    background: ThemeToken;
    focusBorder: ThemeToken;
    backgroundPrimary: ThemeToken;
    backgroundSecondary: ThemeToken;
    focusPrimary: ThemeToken;
  };
}

export interface ThemeFonts {
  body: string;
  heading: string;
  mono: string;
  theme: string;
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