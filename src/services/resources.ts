import api from "./api";

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
  quantity: number;
  unit: string;
  value: number | string;
  total: number;
  group: string;
};

export type Coupom = {
  number: string;
  url?: string | null;
  date: string;
  payment: string;
  store: string;
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

export type CoupomCreate = {
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
  getStores: async (): Promise<Merchant[]> => {
    const response = await api.get('/store');

    return response.data;
  },

  getPayments: async (): Promise<Payments[]> => {
    const response = await api.get('/payment');

    return response.data;
  },

  getGroups: async (): Promise<Groups[]> => {
    const response = await api.get('/group');

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

  createCoupon: async (data: CoupomCreate): Promise<Coupom> => {
    const response = await api.post('/coupon', data);

    return response.data;
  },
};
