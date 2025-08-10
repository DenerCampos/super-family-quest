// import { api } from './api';
import type { ThemeNamespace } from '../i18n/types';

interface AvailableTheme {
  id: ThemeNamespace;
  name: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  requiredCoins?: number;
}

export const themeService = {
  // Busca os temas disponíveis para o usuário
//   async getAvailableThemes(): Promise<AvailableTheme[]> {
//     const response = await api.get<AvailableTheme[]>('/themes/available');
//     return response.data;
//   },

  // Simula a resposta da API enquanto não implementamos o backend
  async mockGetAvailableThemes(): Promise<AvailableTheme[]> {
    // Simula delay da rede
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: 'default',
        name: 'Modo Padrão',
        isUnlocked: true, // Sempre desbloqueado
      },
      {
        id: 'rpg',
        name: 'Modo RPG Medieval',
        isUnlocked: true,
        requiredCoins: 1000,
      },
    ];
  },
}; 