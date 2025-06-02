import api from "./api";

export const UserService = {
  register: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> => {
    const response = await api.post('/user', {
      name,
      email,
      password,
    });   

    return response.data;
  },
};
