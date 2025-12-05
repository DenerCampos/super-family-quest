import api from "./api";
import type { CouponReader } from "./couponReader";

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
  total: number | string;
  group: Groups;
};

export type ExpenseComplete = {
  id?: string;
  name: string;
  uri: string;
  value: number | string;
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

  getExpenseById: async (id: string): Promise<ExpenseComplete> => {
    const response = await api.get(`/expense/${id}`);

    return response.data;
  },

  analyzeAudio: async (audioFile: File): Promise<CouponReader> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await api.post('/expense/analyze-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  analyzeImage: async (imageFile: File): Promise<CouponReader> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/expense/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};