import api from "./api";

export type Expense = {
  id?: string;
  name: string;
  value: number;
  repeat: boolean;
  createdAt: string;
}

export type Merchant = {
  id?: string;
  name: string;
};

export type Payments = {
  id?: string;
  name: string;
};

export type Groups = {
  id?: string;
  name: string;
};

export type Items = {
  id?: string;
  code: string | null;
  name: string;
  quantity: number | string;
  unit: string;
  value: number | string;
  total: number;
  group: Groups;
};

export type ExpenseComplete = {
  id?: string;
  name: string;
  uri: string;
  value: number;
  repeat: boolean;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
  payment: Payments;
  store: Merchant;
  items: Array<Items>;
};

export type ExpenseRecurring = {
  expenses: ExpenseComplete[];
  expenseIds: string[];
};

export const ExpenseService = {
  getLatest: async (limit = 5): Promise<Expense[] | []> => {
    const response = await api.get(`/expense/latest/${limit}`);

    return response.data;
  },

  postRecurringConfirm: async (expenses: ExpenseRecurring): Promise<void> => {
    const response = await api.post(`/expense/recurring/confirm`, expenses);

    return response.data;
  },

  getRecurring: async (): Promise<ExpenseComplete[]> => {
    const response = await api.get(`/expense/recurring/current-month`);

    return response.data;
  },
};