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

export const ProfileService = {
  profile: async (): Promise<UserProfile> => {
    const response = await api.get('/profile');

    return response.data;
  },

  completeProfile: async ({
    family,
    income,
    incomeName,
    repeatMonthly,
  }: {
    family: string;
    income: number;
    incomeName: string;
    repeatMonthly: boolean;
  }): Promise<void> => {
    await api.post('/profile/complete-profile', {
      family,
      income,
      name: incomeName,
      repeatMonthly,
    });
  },

  getLatestRegistrations: async (limit = 5): Promise<Registration[] | []> => {
    const response = await api.get(`/profile/latest-registrations?limit=${limit}`);

    return response.data.data;
  },
};