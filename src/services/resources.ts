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
  id: string;
  name: string;
};

export type Payments = {
  id: string;
  name: string;
};

export type Groups = {
  id: string;
  name: string;
};

export type Items = {
  code: string | null;
  name: string;
  quantity: number | string;
  unit: string;
  value: number | string;
  total: number;
  group: Groups;
};

export type Expense = {
  id: string;
  name: string;
  uri: string;
  value: number;
  repeat: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
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

export type CoupomExpense = {
  number: string;
  url?: string | null;
  date: string;
  payment: {
    name: string;
  };
  store: {
    name: string;
  };
  items: Array<ItemsCreate>;
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

  createExpense: async (data: CoupomExpense): Promise<Expense> => {
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
};
