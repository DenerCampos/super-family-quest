import type { VisualTheme } from './types';

// Tema padrão (financeiro profissional)
export const defaultTheme: VisualTheme = {
  id: 'default',
  name: 'Default',
  colors: {
    primary: {
      50: '#EBF8FF',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3182CE',
      600: '#2B6CB0',
      700: '#2C5282',
      800: '#2A4365',
      900: '#1A365D',
    },
    secondary: {
      50: '#F0FFF4',
      100: '#C6F6D5',
      200: '#9AE6B4',
      300: '#68D391',
      400: '#48BB78',
      500: '#38A169',
      600: '#2F855A',
      700: '#276749',
      800: '#22543D',
      900: '#1C4532',
    },
    accent: {
      50: '#FFFAF0',
      100: '#FEEBC8',
      200: '#FBD38D',
      300: '#F6AD55',
      400: '#ED8936',
      500: '#DD6B20',
      600: '#C05621',
      700: '#9C4221',
      800: '#7B341E',
      900: '#652B19',
    },
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923'
    },
    chakra: {
      blue: 'blue',
      green: 'green',
      red: 'red',
      yellow: 'yellow',
      purple: 'purple',
      orange: 'orange',
      pink: 'pink',
      gray: 'gray',
      theme: 'blue',
    },
    background: {
      primary: '#2A4365', // blue.800 - Background principal
      secondary: '#2C5282', // blue.700 - Background de seções
      tertiary: '#2B6CB0', // blue.600 - Background de elementos interativos
      write: '#FFFFFF', // white - Background de escrita
      hover: '#EDF2F7', // gray.200 - Background de elementos interativos
      lastRegistrations: {
        expense: '#FFF5F5', // red.50 - Background de despesas
        revenue: '#F0FFF4', // green.50 - Background de receitas
        neutral: '#F0F0F0', // gray.100 - Background de neutro
        badge: {
          expense: 'red', // red.100 - Border de despesas
          revenue: 'green', // green.100 - Border de receitas
        },
      },
      button: {
        primary: '#2A4365', // purple.500 - Border de despesas
        expense: 'red.500', // red.500 - Border de despesas
        revenue: 'green.500', // green.500 - Border de receitas
        neutral: 'gray.500', // gray.500 - Border de neutro
        inverted: 'white', // white - Texto invertido
        hover: {
          primary: '#2A4365', // blue.800 - Background principal
          secondary: '#2C5282', // blue.700 - Background de seções
          tertiary: '#2B6CB0', // blue.600 - Background de elementos interativos
          expense: 'red.600', // red.600 - Border de despesas
          revenue: 'green.600', // green.600 - Border de receitas
          neutral: 'gray.600', // gray.600 - Border de neutro
        },
      },
    },
    border: {
      primary: '#2A4365', // blue.800 - Border principal
      secondary: '#2C5282', // blue.700 - Border de seções
      tertiary: '#2B6CB0', // blue.600 - Border de elementos interativos
      lastRegistrations: {
        expense: '#F56565', // red.100 - Border de despesas
        revenue: '#48BB78', // green.100 - Border de receitas
        neutral: '#E2E8F0', // gray.200 - Border de neutro
      },
    },
    text: {
      primary: '#FFFFFF', // Texto principal
      secondary: '#A0AEC0', // gray.400 - Texto secundário
      accent: '#3182CE', // blue.500 - Texto destacado
      disabled: '#A0AEC0', // gray.400 - Texto desabilitado
      link: '#3182CE', // blue.500 - Texto de link
      highlight: '#3182CE', // blue.500 - Texto destacado/selecionado
      muted: '#A0AEC0', // gray.400 - Texto secundário/não selecionado
      inverted: '#FFFFFF', // white - Texto invertido
      gold: '#FFD700', // gold - Texto dourado
      silver: '#C0C0C0', // silver - Texto prateado
      bronze: '#CD7F32', // bronze - Texto bronze
      copper: '#B87333', // copper - Texto cobre
      platinum: '#E5E4E2', // platinum - Texto platina
      diamond: '#B9F2FF', // diamond - Texto diamante
      emerald: '#50C878', // emerald - Texto esmeralda
      ruby: '#E0115F', // ruby - Texto rubi
      sapphire: '#0F52BA', // sapphire - Texto safira
      amethyst: '#9966CC', // amethyst - Texto ametista
      default: '#2A4365',
    },
    status: {
      success: '#38A169', // green.500
      error: '#E53E3E', // red.500
      warning: '#D69E2E', // yellow.500
      info: '#3182CE', // blue.500
    },
    summaryCard: {
      expense: {
        bg: '#FFF5F5',
        border: '#F56565',
        text: '#E53E3E',
        heading: '#C53030',
      },
      revenue: {
        bg: '#F0FFF4',
        border: '#48BB78',
        text: '#48BB78',
        heading: '#38A169',
      },
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
        save: '/assets/images/knigth-solare.gif',
        read: '/assets/images/knigth-loading.gif',
        open: '/assets/images/bonfire.gif',
      },
    },
  },
};

// Tema RPG medieval
export const rpgTheme: VisualTheme = {
  id: 'rpg',
  name: 'RPG Medieval',
  colors: {
    primary: {
      50: '#FAF5FF',
      100: '#E9D8FD',
      200: '#D6BCFA',
      300: '#B794F4',
      400: '#9F7AEA',
      500: '#805AD5',
      600: '#6B46C1',
      700: '#553C9A',
      800: '#44337A', // Cor principal do background
      900: '#322659',
    },
    secondary: {
      50: '#FFF5F5',
      100: '#FED7D7',
      200: '#FEB2B2',
      300: '#FC8181',
      400: '#F56565',
      500: '#E53E3E',
      600: '#C53030',
      700: '#9B2C2C',
      800: '#822727',
      900: '#63171B',
    },
    accent: {
      50: '#FFFFF0',
      100: '#FEFCBF',
      200: '#FAF089',
      300: '#F6E05E',
      400: '#ECC94B',
      500: '#D69E2E',
      600: '#B7791F',
      700: '#975A16',
      800: '#744210',
      900: '#5F370E',
    },
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
    chakra: {
      blue: 'blue',
      green: 'green',
      red: 'red',
      yellow: 'yellow',
      purple: 'purple',
      orange: 'orange',
      pink: 'pink',
      gray: 'gray',
      theme: 'purple',
    },
    background: {
      primary: '#44337A', // purple.800 - Background principal
      secondary: '#553C9A', // purple.700 - Background de seções
      tertiary: '#6B46C1', // purple.600 - Background de elementos interativos
      write: '#FFFFFF', // white - Background de escrita
      hover: '#EDF2F7', // gray.200 - Background de elementos interativos
      lastRegistrations: {
        expense: '#FFF5F5', // red.50 - Background de despesas
        revenue: '#F0FFF4', // green.50 - Background de receitas
        neutral: '#F0F0F0', // gray.100 - Background de neutro
        badge: {
          expense: 'red', // red.100 - Border de despesas
          revenue: 'green', // green.100 - Border de receitas
        },
      },
      button: {
        primary: '#44337A', // purple.500 - Border de despesas
        expense: 'red.500', // red.500 - Border de despesas
        revenue: 'green.500', // green.500 - Border de receitas
        neutral: 'gray.500', // gray.500 - Border de neutro
        inverted: 'white', // white - Texto invertido
        hover: {
          primary: '#44337A', // purple.800 - Background principal
          secondary: '#553C9A', // purple.700 - Background de seções
          tertiary: '#6B46C1', // purple.600 - Background de elementos interativos
          expense: 'red.600', // red.600 - Border de despesas
          revenue: 'green.600', // green.600 - Border de receitas
          neutral: 'gray.600', // gray.600 - Border de neutro
        },
      },
    },
    border: {
      primary: '#44337A', // purple.800 - Border principal
      secondary: '#553C9A', // purple.700 - Border de seções
      tertiary: '#6B46C1', // purple.600 - Border de elementos interativos
      lastRegistrations: {
        expense: '#F56565', // red.100 - Border de despesas
        revenue: '#48BB78', // green.100 - Border de receitas
        neutral: '#E2E8F0', // gray.200 - Border de neutro
      },
    },
    text: {
      primary: '#FFFFFF', // Texto principal
      secondary: '#A0AEC0', // gray.400 - Texto secundário/não selecionado
      accent: '#805AD5', // purple.500 - Texto destacado/selecionado
      disabled: '#A0AEC0', // gray.400 - Texto desabilitado
      link: '#805AD5', // purple.500 - Texto de link
      highlight: '#805AD5', // purple.500 - Texto destacado/selecionado
      muted: '#A0AEC0', // gray.400 - Texto secundário/não selecionado
      inverted: '#FFFFFF', // white - Texto invertido
      gold: '#FFD700', // gold - Texto dourado
      silver: '#C0C0C0', // silver - Texto prateado
      bronze: '#CD7F32', // bronze - Texto bronze
      copper: '#B87333', // copper - Texto cobre
      platinum: '#E5E4E2', // platinum - Texto platina
      diamond: '#B9F2FF', // diamond - Texto diamante
      emerald: '#50C878', // emerald - Texto esmeralda
      ruby: '#E0115F', // ruby - Texto rubi
      sapphire: '#0F52BA', // sapphire - Texto safira
      amethyst: '#9966CC', // amethyst - Texto ametista
      default: '#44337A',
    },
    status: {
      success: '#38A169', // green.500
      error: '#E53E3E', // red.500
      warning: '#D69E2E', // yellow.500
      info: '#805AD5', // purple.500
    },
    summaryCard: {
      expense: {
        bg: '#FFF5F5',
        border: '#F56565',
        text: '#E53E3E',
        heading: '#C53030',
      },
      revenue: {
        bg: '#F0FFF4',
        border: '#48BB78',
        text: '#48BB78',
        heading: '#38A169',
      },
    },
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Cinzel Decorative', cursive",
    mono: "'Press Start 2P', cursive",
  },
  assets: {
    images: {
      logo: '/assets/images/logo-rpg.png',
      background: {
        login: '/assets/images/login-bg.png',
        register: '/assets/images/register-bg.png',
        notFound: '/assets/images/notfound-bg.png',
        underConstruction: '/assets/images/under-construction-bg.png',
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