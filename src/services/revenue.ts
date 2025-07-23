import api from "./api";

export type Revenue = {
  id?: string;
  name: string;
  value: number;
  repeat: boolean;
  date: string;
}

export type RevenueRecurring = {
  revenues: Revenue[];
  revenueIds: string[];
};

export const RevenueService = {
  postRecurringConfirm: async (revenues: RevenueRecurring): Promise<void> => {
    const response = await api.post(`/revenue/recurring/confirm`, revenues);

    return response.data;
  },

  getRecurring: async (): Promise<Revenue[]> => {
    const response = await api.get(`/revenue/recurring/current-month`);

    return response.data;
  },
};