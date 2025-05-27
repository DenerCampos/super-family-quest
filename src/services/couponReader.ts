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
  payment: string;
  items: Array<CouponReaderItems>;
};

export const couponReaderService = {
  read: async ({ code }: { code: string }): Promise<CouponReader> => {
    const response = await api.get(`/coupon-reader/${code}`);

    console.log('response', response);

    return response.data;
  },
};