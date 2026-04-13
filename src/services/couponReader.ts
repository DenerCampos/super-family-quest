import api from "./api";

export type CouponReaderItems = {
  code: string;
  name: string;
  quantity: number;
  unit: string;
  value: number;
  total: number;
  group: {
    name: string;
  };
}

export type CouponReader = {
  name: string;
  date: string;
  uri: string;
  repeat: boolean;
  value: number;
  store: {
    name: string;
  }
  payment: {
    name: string
  };
  items: Array<CouponReaderItems>;
};

export const CouponReaderService = {
  read: async ({ url }: { url: string }): Promise<CouponReader> => {
    const response = await api.post('/coupon-reader', { url });

    return response.data;
  },
};