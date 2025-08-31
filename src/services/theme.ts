import api from './api';

export interface ThemeConfig {
  id: string;
  name: string;
  theme: string;
  description: string;
  requiredCoins: number;
  background: string;
  createdAt: string;
  updatedAt: string;
  isUnlocked: boolean;
}

export const themeService = {
  // Busca os temas disponíveis para o usuário
  async getAvailableThemes(): Promise<ThemeConfig[]> {
    const response = await api.get<ThemeConfig[]>('/theme/available');

    return response.data;
  },

  async getActiveTheme(): Promise<ThemeConfig> {
    const response = await api.get<ThemeConfig>('/theme/active');

    return response.data;
  },

  async changeTheme(themeId: string): Promise<void> {
    await api.patch(`/theme/active/update/${themeId}`);
  },

  async createDefaultTheme(userId: string): Promise<void> {
    await api.post(`/theme/create-default-theme/${userId}`);
  },

  async getAllowedThemes(): Promise<ThemeConfig[]> {
    const response = await api.get<ThemeConfig[]>('/theme/allowed');

    return response.data;
  },
}; 