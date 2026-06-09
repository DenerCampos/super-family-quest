import api from "./api";
import { compressImage } from "../utils/compressImage";
import type { RecurrenceForm, RevenueReceipt } from "../types/financial";
import type { CreateRevenue } from "./resources";

export type Revenue = {
  id?: string;
  name: string;
  value: number;
  repeat: boolean;
  date: string;
  photos?: string[];
  recurrence?: RecurrenceForm;
  isInstallment?: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  installmentLabel?: string | null;
};

export type RevenueRecurring = {
  revenues: CreateRevenue[];
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

  getRevenueById: async (id: string): Promise<Revenue> => {
    const response = await api.get(`/revenue/${id}`);

    return response.data;
  },

  getRevenueReceipt: async (id: string): Promise<RevenueReceipt> => {
    const response = await api.get(`/revenue/${id}/receipt`);
    return response.data;
  },

  uploadRevenuePhoto: async (id: string, file: File): Promise<void> => {
    // A compressão já é feita pelo caller (PhotosStep via compressImage)
    const formData = new FormData();
    formData.append('image', file);
    await api.post(`/revenue/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteRevenuePhoto: async (id: string, photoUrl: string): Promise<void> => {
    await api.delete(`/revenue/${id}/photos`, { data: { photoUrl } });
  },

  analyzeAudio: async (audioFile: File): Promise<Revenue> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await api.post('/revenue/analyze-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  analyzeImage: async (imageFile: File): Promise<Revenue> => {
    const compressed = await compressImage(imageFile);
    const formData = new FormData();
    formData.append('image', compressed);

    const response = await api.post('/revenue/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
