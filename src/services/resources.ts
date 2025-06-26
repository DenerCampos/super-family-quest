import api from "./api";

export type PaginationResponse<T> = {
  data: Array<T>;
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
};

export type Merchant = {
  id?: string;
  name: string;
};

export type Payments = {
  id?: string;
  name: string;
};

export type Groups = {
  id?: string;
  name: string;
};

export type Items = {
  id?: string;
  code: string | null;
  name: string;
  quantity: number | string;
  unit: string;
  value: number | string;
  total: number;
  group: Groups;
};

export type Expense = {
  id?: string;
  name: string;
  uri: string;
  value: number;
  repeat: boolean;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
  payment: Payments;
  store: Merchant;
  items: Array<Items>;
};

export type ItemsCreate = {
  code: string | null;
  name: string;
  quantity: number;
  unit: string;
  value: number | string;
  total: number;
  group: {
    name: string;
  };
};

export type CreateExpense = {
  name: string;
  uri: string | null;
  date: string;
  payment: {
    name: string;
  };
  store: {
    name: string;
  };
  items: Array<ItemsCreate>;
};

export type CreateRevenue = {
  name: string;
  value: number;
  repeat: boolean;
}

export type Revenue = {
  id?: string;
  name: string;
  value: number;
  repeat: boolean;
};

export const ResourcesService = {
  getStores: async ({
    page = 1,
    limit = 5,
    search = '',
  }): Promise<PaginationResponse<Merchant>> => {
    const response = await api.get(
      `/store?page=${page}&limit=${limit}&search=${search}`,
    );

    return response.data;
  },

  getPayments: async ({
    page = 1,
    limit = 5,
    search = '',
  }): Promise<PaginationResponse<Payments>> => {
    const response = await api.get(
      `/payment?page=${page}&limit=${limit}&search=${search}`,
    );

    return response.data;
  },

  getGroups: async ({
    page = 1,
    limit = 5,
    search = '',
  }): Promise<PaginationResponse<Groups>> => {
    const response = await api.get(
      `/group?page=${page}&limit=${limit}&search=${search}`,
    );

    return response.data;
  },

  createStore: async ({ name }: { name: string }): Promise<Merchant> => {
    const response = await api.post('/store', {
      name,
    });

    return response.data;
  },

  createPayment: async ({ name }: { name: string }): Promise<Payments> => {
    const response = await api.post('/payment', {
      name,
    });

    return response.data;
  },

  createGroup: async ({ name }: { name: string }): Promise<Groups> => {
    const response = await api.post('/group', {
      name,
    });

    return response.data;
  },

  createExpense: async (data: CreateExpense): Promise<Expense> => {
    const response = await api.post('/expense', data);

    return response.data;
  },

  getExpenses: async ({
    page = 1,
    limit = 5,
    search = '',
  }): Promise<PaginationResponse<Expense>> => {
    const response = await api.get(
      `/expense?page=${page}&limit=${limit}&search=${search}`,
    );

    return response.data;
  },

  updateStore: async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<Merchant> => {
    const response = await api.patch(`/store/${id}`, {
      name,
    });

    return response.data;
  },

  updatePayment: async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<Payments> => {
    const response = await api.patch(`/payment/${id}`, {
      name,
    });

    return response.data;
  },

  updateGroup: async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<Groups> => {
    const response = await api.patch(`/group/${id}`, {
      name,
    });

    return response.data;
  },

  deleteStore: async ({ id }: { id: string }): Promise<void> => {
    const response = await api.delete(`/store/${id}`);

    return response.data;
  },

  deletePayment: async ({ id }: { id: string }): Promise<void> => {
    const response = await api.delete(`/payment/${id}`);

    return response.data;
  },

  deleteGroup: async ({ id }: { id: string }): Promise<void> => {
    const response = await api.delete(`/group/${id}`);

    return response.data;
  },

  deleteExpense: async ({ id }: { id: string }): Promise<void> => {
    const response = await api.delete(`/expense/${id}`);

    return response.data;
  },

  createRevenue: async (data: CreateRevenue): Promise<Revenue> => {
    const response = await api.post('/revenue', data);

    return response.data;
  },

  getRevenues: async ({
    page = 1,
    limit = 5,
    search = '',
  }): Promise<PaginationResponse<Revenue>> => {
    const response = await api.get(
      `/revenue?page=${page}&limit=${limit}&search=${search}`,
    );

    return response.data;
  },

  updateRevenue: async (id: string, data: Partial<CreateRevenue>): Promise<Revenue> => {
    const response = await api.patch(`/revenue/${id}`, data);

    return response.data;
  },

  deleteRevenue: async ({ id }: { id: string }): Promise<void> => {
    const response = await api.delete(`/revenue/${id}`);

    return response.data;
  },
};
