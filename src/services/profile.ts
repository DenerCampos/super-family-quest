import type { UserProfile } from "../contexts/AuthContext";
import api from "./api";

export const ProfileService = {
  profile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile');

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
    await api.post('/user/complete-profile', {
      family,
      income,
      name: incomeName,
      repeatMonthly,
    });
  },
};