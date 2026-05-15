import api from "./api";
import { compressImage } from "../utils/compressImage";

export type Revenue = {
  id?: string;
  name: string;
  value: number;
  repeat: boolean;
  date: string;
};

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

  getRevenueById: async (id: string): Promise<Revenue> => {
    const response = await api.get(`/revenue/${id}`);

    return response.data;
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
