import api from "./api";

export const AuthService = {
  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  },

  demoLogin: async (key: string): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/demo', { key });
    return response.data;
  },
};
