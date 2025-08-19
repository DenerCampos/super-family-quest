import type { VisualTheme } from './types';

// Paleta de cores do Chakra UI
export const chakraColors = {
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#111111',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#991919',
    800: '#511111',
    900: '#300c0c',
    950: '#1f0808',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#92310a',
    800: '#6c2710',
    900: '#3b1106',
    950: '#220a04',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#845209',
    800: '#713f12',
    900: '#422006',
    950: '#281304',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#116932',
    800: '#124a28',
    900: '#042713',
    950: '#03190c',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0c5d56',
    800: '#114240',
    900: '#032726',
    950: '#021716',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#a3cfff',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#173da6',
    800: '#1a3478',
    900: '#14204a',
    950: '#0c142e',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0c5c72',
    800: '#134152',
    900: '#072a38',
    950: '#051b24',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#641ba3',
    800: '#4a1772',
    900: '#2f0553',
    950: '#1a032e',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#a41752',
    800: '#6d0e34',
    900: '#45061f',
    950: '#2c0514',
  },
};

// Tema padrão (financeiro profissional)
export const defaultTheme: VisualTheme = {
  id: 'default',
  name: 'Default',
  colors: {
    // Cores principais do tema
    primary: chakraColors.blue,
    secondary: chakraColors.green,
    accent: chakraColors.yellow,
    gray: chakraColors.gray,

    // Tokens semânticos
    background: {
      primary: {
        light: 'blue.50',
        dark: 'blue.800',
      },
      secondary: {
        light: 'blue.100',
        dark: 'blue.700',
      },
      tertiary: {
        light: 'blue.200',
        dark: 'blue.600',
      },
      write: {
        light: 'white',
        dark: 'gray.800',
      },
      hover: {
        light: 'gray.100',
        dark: 'gray.700',
      },
      lastRegistrations: {
        expense: {
          light: 'red.50',
          dark: 'red.900',
        },
        revenue: {
          light: 'green.50',
          dark: 'green.900',
        },
        neutral: {
          light: 'gray.100',
          dark: 'gray.700',
        },
      },
    },
    text: {
      primary: {
        light: 'gray.800',
        dark: 'white',
      },
      secondary: {
        light: 'gray.600',
        dark: 'gray.300',
      },
      accent: {
        light: 'blue.500',
        dark: 'blue.300',
      },
      disabled: {
        light: 'gray.400',
        dark: 'gray.500',
      },
      link: {
        light: 'blue.500',
        dark: 'blue.300',
      },
    },
    border: {
      primary: {
        light: 'blue.200',
        dark: 'blue.700',
      },
      secondary: {
        light: 'gray.200',
        dark: 'gray.600',
      },
    },
    status: {
      success: {
        light: 'green.500',
        dark: 'green.300',
      },
      error: {
        light: 'red.500',
        dark: 'red.300',
      },
      warning: {
        light: 'yellow.500',
        dark: 'yellow.300',
      },
      info: {
        light: 'blue.500',
        dark: 'blue.300',
      },
    },
    button: {
      primary: 'blue',
      secondary: 'green',
      danger: 'red',
      warning: 'yellow',
    },
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Poppins', sans-serif",
    mono: "'Roboto Mono', monospace",
  },
  assets: {
    images: {
      logo: '/assets/images/logo-default.png',
      background: {
        login: '/assets/images/login-bg-default.jpg',
        register: '/assets/images/register-bg-default.jpg',
        notFound: '/assets/images/notfound-bg-default.jpg',
        underConstruction: '/assets/images/under-construction-bg-default.jpg',
      },
      coatOfArms: {
        family: '/assets/images/coat_of_arms_family.png',
        solare: '/assets/images/coat_of_arms_solare.png',
      },
      goldCoin: '/assets/images/gold-coin.gif',
    },
    animations: {
      loading: {
        save: '/assets/images/loading-save.gif',
        read: '/assets/images/loading-read.gif',
        open: '/assets/images/loading-open.gif',
      },
    },
  },
};

// Tema RPG medieval
export const rpgTheme: VisualTheme = {
  id: 'rpg',
  name: 'RPG Medieval',
  colors: {
    // Cores principais do tema
    primary: 'purple',
    secondary: 'red',
    accent: 'yellow',
    gray: 'gray',
    revenue: 'green',
    expense: 'red',
    chakraColors: {
      red: 'red',
      green: 'green',
      yellow: 'yellow',
      purple: 'purple',
      blue: 'blue',
      cyan: 'cyan',
      pink: 'pink',
      orange: 'orange',
      teal: 'teal',
      gray: 'gray',
      white: 'white',
      black: 'black',
    },
    // Tokens semânticos
    background: {
      primary: {
        light: 'purple.50',
        dark: 'purple.800',
      },
      secondary: {
        light: 'purple.50',
        dark: 'purple.700',
      },
      tertiary: {
        light: 'purple.200',
        dark: 'purple.600',
      },
      quaternary: {
        light: 'purple.50',
        dark: 'purple.50',
      },
      selected: {
        light: 'purple.500',
        dark: 'purple.500',
      },
      noSelect: {
        light: 'gray.200',
        dark: 'gray.200',
      },
      write: {
        light: 'white',
        dark: 'gray.800',
      },
      hover: {
        light: 'gray.100',
        dark: 'gray.700',
      },
      lastRegistrations: {
        expense: {
          light: 'red.50',
          dark: 'red.50',
        },
        revenue: {
          light: 'green.50',
          dark: 'green.50',
        },
        neutral: {
          light: 'gray.100',
          dark: 'gray.700',
        },
      },
      loading: {
        light: 'purple.500',
        dark: 'purple.500',
      },
      //remover
      summaryCard: {
        revenue: {
          light: 'green.500',
          dark: 'green.200',
        },
        expense: {
          light: 'red.500',
          dark: 'red.200',
        },
      },
      login: {
        light: 'rgba(23, 25, 35, 0.8)',
        dark: 'rgba(23, 25, 35, 0.8)',
      },
    },
    text: {
      primary: {
        light: 'gray.800',
        dark: 'white',
      },
      secondary: {
        light: 'gray.600',
        dark: 'gray.500',
      },
      tertiary: {
        light: 'gray.500',
        dark: 'gray.200',
      },
      accent: {
        light: 'purple.800',
        dark: 'purple.800',
      },
      disabled: {
        light: 'gray.400',
        dark: 'gray.500',
      },
      link: {
        light: 'purple.500',
        dark: 'purple.300',
      },
      gold: {
        light: 'yellow.500',
        dark: 'yellow.500',
      },
      summaryCard: {
        revenue: {
          light: 'green.900',
          dark: 'green.700',
        },
        expense: {
          light: 'red.900',
          dark: 'red.700',
        },
      },
      lastRegistrations: {
        expense: {
          light: 'red.500',
          dark: 'white',
        },
        revenue: {
          light: 'green.500',
          dark: 'white',
        },
      },
    },
    heading: {
      summaryCard: {
        revenue: {
          light: 'green.900',
          dark: 'green.700',
        },
        expense: {
          light: 'red.900',
          dark: 'red.700',
        },
      },
    },
    border: {
      primary: {
        light: 'purple.200',
        dark: 'purple.700',
      },
      secondary: {
        light: 'gray.200',
        dark: 'gray.600',
      },
      selected: {
        light: 'purple.500',
        dark: 'purple.500',
      },
      noSelect: {
        light: 'gray.200',
        dark: 'gray.200',
      },
      lastRegistrations: {
        expense: {
          light: 'red.500',
          dark: 'red.500',
        },
        revenue: {
          light: 'green.500',
          dark: 'green.500',
        },
        neutral: {
          light: 'gray.100',
          dark: 'gray.700',
        },
      },
      summaryCard: {
        revenue: {
          light: 'green.800',
          dark: 'green.500',
        },
        expense: {
          light: 'red.800',
          dark: 'red.500',
        },
      },
    },
    status: {
      success: {
        light: 'green.500',
        dark: 'green.300',
      },
      error: {
        light: 'red.500',
        dark: 'red.300',
      },
      warning: {
        light: 'yellow.500',
        dark: 'yellow.300',
      },
      info: {
        light: 'purple.500',
        dark: 'purple.300',
      },
    },
    button: {
      primary: {
        light: 'purple',
        dark: 'purple',
      },
      secondary: {
        light: 'purple',
        dark: 'purple',
      },
      danger: {
        light: 'red',
        dark: 'red',
      },
      warning: {
        light: 'yellow',
        dark: 'yellow',
      },
    },
    link: {
      primary: {
        light: 'blue.300',
        dark: 'blue.300',
      },
    },
    input: {
      primary: {
        light: 'white',
        dark: 'white',
      },
      secondary: {
        light: 'gray.200',
        dark: 'gray.200',
      },
      hover: {
        light: 'transparent',
        dark: 'transparent',
      },
      focus: {
        light: 'transparent',
        dark: 'transparent',
      },
      border: {
        light: 'purple.200',
        dark: 'white',
      },
      focusBorder: {
        light: 'blue.300',
        dark: 'blue.600',
      },
      background: {
        light: 'transparent',
        dark: 'transparent',
      },
      backgroundPrimary: {
        light: 'purple.50',
        dark: 'purple.600',
      },
      backgroundSecondary: {
        light: 'purple.50',
        dark: 'purple.700',
      },
      focusPrimary: {
        light: 'purple.500',
        dark: 'transparent',
      },
    },
  },
  fonts: {
    body: 'system-ui',
    heading: 'Helvetica',
    mono: "'Press Start 2P', cursive",
    theme: "'Pixelify Sans', sans-serif",
  },
  assets: {
    images: {
      logo: '/assets/images/logo-rpg.png',
      background: {
        login: '/assets/images/login-bg-medieval.png',
        register: '/assets/images/register-bg-medieval.png',
        notFound: '/assets/images/notfound-bg-medieval.png',
        underConstruction: '/assets/images/under-construction-bg-medieval.png',
      },
      coatOfArms: {
        family: '/assets/images/coat_of_arms_family.png',
        solare: '/assets/images/coat_of_arms_solare.png',
      },
      goldCoin: '/assets/images/gold-coin.gif',
    },
    animations: {
      loading: {
        save: '/assets/images/knigth-solare.gif',
        read: '/assets/images/knigth-loading.gif',
        open: '/assets/images/bonfire.gif',
      },
    },
  },
};