import type { VisualTheme } from './types';

// Tema padrão (financeiro profissional)
export const defaultTheme: VisualTheme = {
  id: 'default',
  name: 'Default',
  colors: {
    primary: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3', // Azul principal
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    secondary: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50', // Verde principal
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    accent: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800', // Laranja principal
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#EEEEEE',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      accent: '#2196F3',
    },
    status: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
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
    },
    animations: {
      loading: {
        save: '/assets/animations/loading-save-default.gif',
        read: '/assets/animations/loading-read-default.gif',
        open: '/assets/animations/loading-open-default.gif',
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
      50: '#F3E5F5',
      100: '#E1BEE7',
      200: '#CE93D8',
      300: '#BA68C8',
      400: '#AB47BC',
      500: '#9C27B0', // Roxo principal
      600: '#8E24AA',
      700: '#7B1FA2',
      800: '#6A1B9A',
      900: '#4A148C',
    },
    secondary: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336', // Vermelho principal
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C',
    },
    accent: {
      50: '#FFF8E1',
      100: '#FFECB3',
      200: '#FFE082',
      300: '#FFD54F',
      400: '#FFCA28',
      500: '#FFC107', // Dourado principal
      600: '#FFB300',
      700: '#FFA000',
      800: '#FF8F00',
      900: '#FF6F00',
    },
    background: {
      primary: '#1A1A1A',
      secondary: '#2D2D2D',
      tertiary: '#3D3D3D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#BDBDBD',
      accent: '#9C27B0',
    },
    status: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      info: '#9C27B0',
    },
  },
  fonts: {
    body: "'MedievalSharp', cursive",
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