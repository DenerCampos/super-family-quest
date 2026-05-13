import type { ThemeNamespace } from '../i18n/types';


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
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    selected: string;
    noSelect: string;
    hover: string;
    header: string;
    navigation: string;
    lastRegistrations: {
      expense: string;
      revenue: string;
      neutral: string;
      badge: {
        expense: string;
        revenue: string;
      };
    };
    loading: string;
    summaryCard: {
      revenue: string;
      expense: string;
    };
    login: string;
    reports: string;
    coin: string;
    home: string;
    dashboard: {
      primary: string;
      tile: string;
      tileActive: string;
      filterBar: string;
    };
    resources: string;
    settings: string;
    profile: {
      primary: string;
      secondary: string;
      selected: string;
    };
    dateRangeFilter: string;
    qrScanner: string;
    familyStories: {
      container: string;
      avatar: string;
      selected: string;
    };
    familyGroup: {
      primary: string;
      card: string;
      memberCard: string;
      elevatedShadow: string;
      badge: {
        owner: string;
        admin: string;
        member: string;
        pending: string;
        notification: string;
      };
    };
    resourceTable: {
      userBadge: string;
      panel: string;
    };
    shell: {
      outer: string;
      inner: string;
      /** Sombra do painel central em viewports grandes (valor CSS cru) */
      desktopPanelShadow: string;
    };
    shoppingList: {
      primary: string;
      card: string;
      cardHover: string;
      itemPending: string;
      itemInCart: string;
      categoryHeader: string;
      onlineIndicator: string;
      addInput: string;
    };
    integrations: {
      statusConnected: string;
      statusDisconnected: string;
    };
  };

  // Tokens semânticos para texto
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    disabled: string;
    link: string;
    coin: string;
    summaryCard: {
      revenue: string;
      expense: string;
    };
    lastRegistrations: {
      title: string;
      primary: string;
      icon: string;
      neutral: string;
      expense: string;
      revenue: string;
    };
    reports: {
      title: string;
      primary: string;
      icon: string;
      neutral: string;
      expense: string;
      revenue: string;
    };
    header: string;
    navigation: {
      active: string;
      inactive: string;
    };
    hover: {
      expense: string;
      revenue: string;
      neutral: string;
      inverse: string;
    };
    eye: string;
    dateRangeFilter: string;
    dashboard: {
      title: string;
      tileTitle: string;
      tileSubtitle: string;
      tileIcon: string;
      tileIconActive: string;
      filterLabel: string;
    };
    profile: {
      primary: string;
      secondary: string;
      selected: string;
    };
    familyStories: {
      name: string;
      selectedName: string;
    };
    familyGroup: {
      title: string;
      primary: string;
      secondary: string;
      badge: {
        owner: string;
        admin: string;
        member: string;
        pending: string;
        notification: string;
      };
    };
    resourceTable: {
      userBadge: string;
      searchIcon: string;
      badgeCount: string;
    };
    shoppingList: {
      title: string;
      primary: string;
      secondary: string;
      itemName: string;
      itemNameChecked: string;
      itemMeta: string;
      categoryTitle: string;
      onlineDot: string;
      onlineName: string;
      badge: {
        pending: string;
        inCart: string;
      };
    };
    integrations: {
      title: string;
      description: string;
      statusConnected: string;
      statusDisconnected: string;
    };
  };

  // Tokens semânticos para heading
  heading: {
    summaryCard: {
      revenue: string;
      expense: string;
    };
  };

  // Tokens semânticos para bordas
  border: {
    primary: string;
    secondary: string;
    selected: string;
    noSelect: string;
    lastRegistrations: {
      expense: string;
      revenue: string;
      neutral: string;
    };
    summaryCard: {
      revenue: string;
      expense: string;
    };
    reports: string;
    dashboard: {
      tile: string;
      tileActive: string;
    };
    header: string;
    navigation: string;
    coin: string;
    familyStories: {
      default: string;
      selected: string;
    };
    familyGroup: {
      card: string;
    };
    shoppingList: {
      card: string;
      item: string;
      categoryHeader: string;
      checkbox: {
        pending: string;
        inCart: string;
      };
    };
    integrations: {
      card: string;
      statusConnected: string;
      statusDisconnected: string;
    };
  };

  // Tokens semânticos para status
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };

  // Configuração de botões usando cores do Chakra
  button: {
    primary: string;
    secondary: string;
    danger: string;
    warning: string;
    background: {
      primary: string;
      expense: string;
      revenue: string;
      neutral: string;
      inverse: string;
    };
    text: {
      primary: string;
      expense: string;
      revenue: string;
    };
    border: {
      expense: string;
      revenue: string;
      neutral: string;
    };
    hover: {
      text: {
        default: string;
        expense: string;
        revenue: string;
        neutral: string;
        inverse: string;
      };
      background: {
        default: string;
        expense: string;
        revenue: string;
        neutral: string;
        inverse: string;
      };
      border: {
        default: string;
        expense: string;
        revenue: string;
        neutral: string;
        inverse: string;
      };
    };
  };

  link: {
    primary: string;
  };

  input: {
    primary: string;
    secondary: string;
    hover: string;
    focus: string;
    border: string;
    background: string;
    focusBorder: string;
    backgroundPrimary: string;
    backgroundSecondary: string;
    focusPrimary: string;
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