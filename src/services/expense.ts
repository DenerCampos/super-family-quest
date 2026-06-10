import api from "./api";
import type { CouponReader } from "./couponReader";
import { compressImage } from "../utils/compressImage";
import type { ExpenseReceipt, RecurrenceForm } from "../types/financial";
import type { CreateExpense } from "./resources";

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
  warrantyDuration?: number | null;
  warrantyUnit?: string | null;
  warrantyExpiresAt?: string | null;
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
  photos?: string[];
  recurrence?: RecurrenceForm;
  isInstallment?: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  installmentLabel?: string | null;
};

export type ExpenseRecurring = {
  expenses: CreateExpense[];
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

  getExpenseReceipt: async (id: string): Promise<ExpenseReceipt> => {
    const response = await api.get(`/expense/${id}/receipt`);
    return response.data;
  },

  uploadExpensePhoto: async (id: string, file: File): Promise<void> => {
    // A compressão já é feita pelo caller (PhotosStep via compressImage)
    const formData = new FormData();
    formData.append('image', file);
    await api.post(`/expense/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteExpensePhoto: async (id: string, photoUrl: string): Promise<void> => {
    await api.delete(`/expense/${id}/photos`, { data: { photoUrl } });
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
    const compressed = await compressImage(imageFile);
    const formData = new FormData();
    formData.append('image', compressed);

    const response = await api.post('/expense/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};