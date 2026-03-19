import type { UserProfile } from "../contexts/AuthContext";
import api from "./api";

export type RegistrationType = 'expense' | 'revenue';

export type Registration = {
  id: string;
  name: string;
  value: number;
  coins: number;
  type: RegistrationType;
  date: string;
};

export type PaginationMeta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PaginationLinks = {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
};

export type PaginatedRegistrations = {
  data: Registration[];
  meta: PaginationMeta;
  links: PaginationLinks;
};

export const ProfileService = {
  profile: async (): Promise<UserProfile> => {
    const response = await api.get('/profile');

    return response.data;
  },

  completeProfile: async ({
    family,
    income,
    incomeName,
    date,
    repeatMonthly,
  }: {
    family: string;
    income: number;
    incomeName: string;
    date: string;
    repeatMonthly: boolean;
  }): Promise<void> => {
    await api.post('/profile/complete-profile', {
      family,
      income,
      name: incomeName,
      date,
      repeatMonthly,
    });
  },

  getLatestRegistrations: async (limit = 5): Promise<Registration[]> => {
    const response = await api.get(`/profile/latest-registrations?limit=${limit}`);
    return response.data.data;
  },

  getLatestRegistrationsPaginated: async (
    page = 1,
    limit = 5,
  ): Promise<PaginatedRegistrations> => {
    const response = await api.get(
      `/profile/latest-registrations?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  uploadImage: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/profile/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};