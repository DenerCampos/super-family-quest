import type { UserProfile } from "../contexts/AuthContext";
import api from "./api";

export const ProfileService = {
  profile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile');

    console.log('response', response);

    return response.data;
  },

  completeProfile: async ({
    family,
    income,
  }: {
    family: string;
    income: number;
  }): Promise<void> => {
    await api.post('/user/complete-profile', {
      family,
      income,
    });
  },
}