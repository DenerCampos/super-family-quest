import api from "./api";

export type UserUpdate = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  family?: string;
  coatOfArms?: string;
};

export type UserSearchItem = {
  id: string;
  name: string;
  email: string;
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

  /** Autocomplete de convite (SP-127). Mín. 3 caracteres. */
  searchByEmail: async (email: string): Promise<UserSearchItem[]> => {
    const response = await api.get<UserSearchItem[]>('/user/search', {
      params: { email },
    });
    return response.data;
  },

  deleteAccount: async ({
    id,
    password,
  }: {
    id: string;
    password: string;
  }): Promise<{ deleted: boolean }> => {
    const response = await api.delete(`/user/${id}`, {
      data: { password },
    });
    return response.data;
  },
};
