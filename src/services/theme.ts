// import { api } from './api';
import type { ThemeNamespace } from '../i18n/types';
import { defaultTheme, rpgTheme } from '../theme/themes';

export interface ThemeConfig {
  id: ThemeNamespace;
  name: string;
  theme: typeof defaultTheme;
  requiredCoins?: number;
  description?: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  background?: string;
}

export const themeService = {
  // Busca os temas disponíveis para o usuário
//   async getAvailableThemes(): Promise<AvailableTheme[]> {
//     const response = await api.get<AvailableTheme[]>('/themes/available');
//     return response.data;
//   },

  // Simula a resposta da API enquanto não implementamos o backend
  async mockGetAvailableThemes(): Promise<ThemeConfig[]> {
    // Simula delay da rede
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: 'default',
        name: 'Modo Padrão',
        theme: defaultTheme,
        description: 'Tema profissional para gestão financeira',
        isUnlocked: true,
        background: '/assets/images/background-theme-default.png',
      },
      {
        id: 'rpg',
        name: 'RPG Medieval',
        theme: rpgTheme,
        requiredCoins: 1000,
        description: 'Tema medieval com elementos de RPG',
        isUnlocked: true,
        background: '/assets/images/background-theme-medieval.png',
      },
      {
        id: 'cyberpunk', // Adicionar esse id em ThemeNamespace
        name: 'Cyberpunk',
        theme: rpgTheme, // Criar o tema em themes.ts
        requiredCoins: 2000,
        description: 'Tema futurista com elementos neon',
        isUnlocked: false,
        background: '/assets/images/background-theme-default.png',
      },
      // Para adicionar um novo tema, basta adicionar aqui:
      // {
      //   id: 'cyberpunk', // Adicionar esse id em ThemeNamespace
      //   name: 'Cyberpunk',
      //   theme: cyberpunkTheme, // Criar o tema em themes.ts
      //   requiredCoins: 2000,
      //   description: 'Tema futurista com elementos neon',
      // },
    ];
  },
}; 