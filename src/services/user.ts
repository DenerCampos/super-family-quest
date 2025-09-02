import api from "./api";

export type UserUpdate = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  family?: string;
  coatOfArms?: string;
};

export const UserService = {
  register: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    id: string;
    name: string;
    email: string;
    family: string;
    coatOfArms: string;
    createdAt: string;
    updatedAt: string;
  }> => {
    const response = await api.post('/user', {
      name,
      email,
      password,
    });

    return response.data;
  },

  update: async ({
    id,
    name,
    email,
    password,
    family,
    coatOfArms,
  }: UserUpdate): Promise<void> => {
    const response = await api.patch(`/user/${id}`, {
      name,
      email,
      password,
      family,
      coatOfArms,
    });

    return response.data;
  },
};
