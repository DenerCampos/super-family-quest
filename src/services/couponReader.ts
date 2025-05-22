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
  items: Array<CouponReaderItems>;
};

export const couponReader = {
  read: async ({ code }: { code: string }): Promise<CouponReader> => {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    console.log(code);
    
    return {
      items: [
        {
          code: '7100105',
          name: 'Stacker Duplo Bacon',
          quantity: 1,
          unit: 'UN',
          value: 12.9,
          total: 12.9,
          group: {
            name: 'Restaurante',
          },
        },
        {
          code: '6012',
          name: 'Batata Media',
          quantity: 1,
          unit: 'UN',
          value: 5,
          total: 5,
          group: {
            name: 'Restaurante',
          },
        },
        {
          code: '9008',
          name: 'Refri',
          quantity: 1,
          unit: 'UN',
          value: 13.9,
          total: 13.9,
          group: {
            name: 'Restaurante',
          },
        },
        {
          code: '7100036',
          name: 'Rodeio',
          quantity: 1,
          unit: 'UN',
          value: 10.9,
          total: 10.9,
          group: {
            name: 'Restaurante',
          },
        },
      ],
      uri: '31230913574594092961650010009531601631841167|2|1|1|A0A0CD054D84831FC050E31EE43ACB96CC935ACF',
      date: '2025-05-21T18:20:50.447Z',
      name: 'BK BRASIL OPERACAO E ASSESSORIA A RESTAURANTES S.A.',
    };
  },
};