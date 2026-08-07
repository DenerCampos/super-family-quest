import type { UserProfile } from "../contexts/AuthContext";
import type { UserSummary } from '../types/user';
import api from "./api";

export type RegistrationType = 'expense' | 'revenue';

export type Registration = {
  id: string;
  name: string;
  value: number;
  coins: number;
  type: RegistrationType;
  date: string;
  user?: UserSummary | null;
  isInstallment?: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  installmentLabel?: string | null;
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
    income?: number;
    incomeName?: string;
    date?: string;
    repeatMonthly?: boolean;
  }): Promise<void> => {
    await api.post('/profile/complete-profile', {
      family,
      ...(income !== undefined && { income }),
      ...(incomeName !== undefined && { name: incomeName }),
      ...(date !== undefined && { date }),
      ...(repeatMonthly !== undefined && { repeatMonthly }),
    });
  },

  getLatestRegistrations: async (
    limit = 5,
    familyGroupId?: string | null,
  ): Promise<Registration[]> => {
    const response = await api.get(`/profile/latest-registrations`, {
      params: {
        limit,
        ...(familyGroupId ? { familyGroupId } : {}),
      },
    });
    return response.data.data;
  },

  getLatestRegistrationsPaginated: async (
    page = 1,
    limit = 5,
    familyGroupId?: string | null,
  ): Promise<PaginatedRegistrations> => {
    const response = await api.get(`/profile/latest-registrations`, {
      params: {
        page,
        limit,
        ...(familyGroupId ? { familyGroupId } : {}),
      },
    });
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
