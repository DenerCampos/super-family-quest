import api from "./api";

export type Revenue = {
  id?: string;
  name: string;
  value: number;
  repeat: boolean;
}

export const RevenueService = {
  confirmNewMonthIncomes: async (): Promise<void> => {
    const response = await api.post(`/revenue/confirm-new-month-revenues`);

    return response.data;
  },

  getRepeatedIncomes: async (): Promise<Revenue[]> => {
    const response = await api.get(`/revenue/repeated-revenues`);

    return response.data;
  },
};