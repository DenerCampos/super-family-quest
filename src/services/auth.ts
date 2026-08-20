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

  reactivateAccount: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/reactivate', {
      email,
      password,
    });
    return response.data;
  },

  // A API responde igual exista ou não a conta, para não revelar e-mails cadastrados.
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },
};
