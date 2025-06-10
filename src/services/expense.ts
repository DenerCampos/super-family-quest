import api from "./api";

export type Expense = {
  id?: string;
  name: string;
  value: number;
  repeat: boolean;
  createdAt: string;
}

export const ExpenseService = {
  getLatest: async (limit = 5): Promise<Expense[] | []> => {
    const response = await api.get(`/expense/latest/${limit}`);

    return response.data;
  },
};