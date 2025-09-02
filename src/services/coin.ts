import api from './api';

export interface BalanceCoin {
  balance: number;
}

export const CoinService = {
  // Busca os temas disponíveis para o usuário
  async getBalanceCoin(): Promise<BalanceCoin> {
    const response = await api.get<BalanceCoin>('/coin/balance');

    return response.data;
  },
}; 