import type { CouponReader } from "../services/couponReader";
import type { Coupom } from "../services/resources";
import { formatCurrencyBRL } from "./formatCurrency";
import { formatDateToYYYYMMDD } from "./formatDate";



export const convertQRData = (qrData: CouponReader): Coupom | null => {
  try {
    const {uri, date, name, items} = qrData;

    const parsedItems = items.map((item) => {
      const {name, quantity, value, unit, group, code} = item;
      return {
        code: code ?? Math.random().toString(36).substr(2, 9),
        name,
        quantity: Number(quantity),
        value: formatCurrencyBRL(value.toString()),
        unit,
        group: group.name,
        total: Number(quantity) * Number(value),
      };
    });
    
    return {
      number: '',
      url: uri,
      date: formatDateToYYYYMMDD(date),
      store: name,
      payment: '',
      items: parsedItems,
    };
  } catch (error) {
    console.error('Erro ao converter dados do QR Code:', error);
    return null;
  }
};
