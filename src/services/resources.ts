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
  url: string | null;
  date: string;
  payment: string;
  store: string;
  items: Array<Items>;
};

export const resources = {
  getStores: async (): Promise<Merchant[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: '0499854d-6342-4077-8af1-0fe2df60cd6e',
        name: 'DROGARIA ARAUJO S.A..',
      },
      {
        id: '0d4c9f56-f6a3-4f67-bf5a-7d80e5fed6d7',
        name: 'PADARIA DOIS IRMÃOS',
      },
      {
        id: '2979dee3-2295-419d-b270-84ee3e2167eb',
        name: 'MC DONALDS',
      },
      {
        id: '3b77ec1e-5edd-461d-b54c-98b476e24104',
        name: 'SUPERMERCADO SUPER NOSSO',
      },
      {
        id: '446107d2-36b6-4cd7-9e55-2395c2ca7aaf',
        name: 'SUPERMERCADOS BH COMERCIO DE ALIMENTOS S/A',
      },
      {
        id: '508093f4-8f60-4448-81f2-6b45adb1ee84',
        name: 'RENNER',
      },
      {
        id: '667ae864-ed6d-4ace-a139-3a23e7c061c5',
        name: 'AMERICANAS SA',
      },
      {
        id: '8319ebed-90e6-4cc7-bc0f-53c5ab576162',
        name: 'SUPERMERCADOS BH COMERCIOS DE ALIMENTOS S.A',
      },
      {
        id: '8b49777a-264c-45bd-bfe6-251a28eb52e1',
        name: 'COMERCIAL TAUBATE LTDA',
      },
      {
        id: '99140248-a907-42c1-a6b8-20ba33cd765f',
        name: 'LOJAS REDE COMERCIAL LTDA',
      },
      {
        id: '99146613-2ae2-4e1a-98d5-acf031ddb59d',
        name: 'LOJAS REBUEN LTDA',
      },
      {
        id: 'a42a1052-80bd-41af-b955-f255909fbf24',
        name: 'HABIBIS',
      },
      {
        id: 'aa5ac557-0add-414a-9aa0-a54627db5e4b',
        name: '1001 FESTAS',
      },
      {
        id: 'b0f8df73-b32e-498c-b2b1-d6c25268522b',
        name: 'CACAU SHOW',
      },
      {
        id: 'b2afd68f-5446-4ed8-83a5-f45c36d52620',
        name: 'KFC BH ALIMENTACAO LTDA',
      },
      {
        id: 'b5094fd7-e0bb-45e1-acdc-f0f10097b8e0',
        name: 'FRANQUIAS EMPREENDIMENTOS FINANCEIROS LT',
      },
      {
        id: 'ba8b3424-82c7-44de-bd4c-8bd1de88d651',
        name: 'CASA E LEITURA MINAS LTDA',
      },
      {
        id: 'c09bd2cf-c3b4-4699-9b80-c9786c016216',
        name: 'PANDA CAPAS',
      },
      {
        id: 'c907679f-a3f9-40b3-888f-915c4b275ada',
        name: 'ROMA PLUS LTDA - EPP',
      },
      {
        id: 'c9c5a9b9-980c-4591-84f1-c06e68a31aa3',
        name: 'LEROY MERLIN CIA BRASILEIRA DE BRICOLAGEM',
      },
      {
        id: 'd6f9786a-3807-4237-8861-18b9a75250b2',
        name: 'DROGARIA SIQUEIRA',
      },
      {
        id: 'dd334fe9-ce72-4e4c-b8fc-d651c384a5eb',
        name: 'SACOLÂO NOVA CANAÂ',
      },
      {
        id: 'e3edf07d-5a85-4655-9668-aaad9fdc47df',
        name: 'LEROY MERLIN COMPANHIA BRASILEIRA DE BRICOLAGEM',
      },
      {
        id: 'e566a550-8156-402f-bec9-9329a59da7c9',
        name: 'SUPERMERCADOS EPA',
      },
      {
        id: 'e726b995-d462-4467-a5e4-34c7705cdd22',
        name: 'CAEDU COM. VAREJISTA DE ARTIGOS DO VESTUARIO LTDA.',
      },
      {
        id: 'eb45aed6-6e34-4231-8bab-fb2b2d498563',
        name: 'SALGADOS GOSTINHO DE MINAS',
      },
      {
        id: 'ec10b263-52b8-414a-bb16-e2d383149e03',
        name: 'SUPERMERCADOS ASSAI',
      },
      {
        id: 'f6220a45-bb08-433a-81ee-714da7b9e50d',
        name: 'ESTRIPULIA BRINQUEDOS',
      },
      {
        id: 'f8587896-5c1b-4e76-be4a-86a7452dd1dd',
        name: 'RIACHUELO S.A',
      },
      {
        id: 'fdcc2a05-0535-4a2b-b8c3-952cc0de67aa',
        name: 'CA MODAS S.A.',
      },
    ];
  },

  getPayments: async (): Promise<Payments[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: '034a959d-a50d-46b7-9c0c-3476e2e5ac1c',
        name: 'euro',
      },
      {
        id: '1e9b628b-4230-4077-bdbc-7140d9bc7b03',
        name: 'Cartão débito',
      },
      {
        id: '38b143b5-47d3-46d0-8fc7-f82477604b28',
        name: 'xerecard',
      },
      {
        id: '83624879-a255-40e4-8314-302ba2bbd255',
        name: 'Pix',
      },
      {
        id: '99702214-4c83-48b1-bfac-bc8e6aaab535',
        name: 'Dinheiro',
      },
      {
        id: 'bb689dc0-c110-4db7-8f2a-378c53085ec9',
        name: 'cheque',
      },
      {
        id: 'd6cd6c1f-39a2-4892-8eaa-8ebe638b7d2f',
        name: 'Cartão crédito',
      },
    ];
  },

  getGroups: async (): Promise<Groups[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: '2f197f49-931e-47a9-b21a-98c9ca44430c',
        name: 'Alimentação',
      },
      {
        id: '31b153df-7309-4214-88bd-b89f063d2b59',
        name: 'Presentes',
      },
      {
        id: '38aff506-4413-47cf-b87a-c6430b35a1e5',
        name: 'Drogaria',
      },
      {
        id: '3beaeff1-22a0-40c8-8410-9760b414e08b',
        name: 'Besteiras',
      },
      {
        id: '3da63f55-c0ef-4912-a63d-898f2660840c',
        name: 'Festas',
      },
      {
        id: '5a0bd7e7-2322-4a3b-94d4-8bdba681b775',
        name: 'Vestuário',
      },
      {
        id: '5d35e4ff-3862-432f-bb8d-ecc54b49af11',
        name: 'Limpeza',
      },
      {
        id: '6893da04-31ad-4856-a7f8-7aec74d99735',
        name: 'Casa',
      },
      {
        id: '697ed02a-60e1-4585-8bac-3bc91fcaf1f1',
        name: 'Higiene',
      },
      {
        id: '85aa44c0-95fc-4476-83c7-3d4102073faf',
        name: 'Construção',
      },
      {
        id: '91f1bd81-d6ae-46a6-9d4e-7cea24a0b59b',
        name: 'Padaria',
      },
      {
        id: 'a9ee3804-6175-4b8a-8d7e-5ef33f0cbda9',
        name: 'Perfumaria e beleza',
      },
      {
        id: 'd7c374c5-8c33-4481-a8f7-73e238671274',
        name: 'Escritório',
      },
      {
        id: 'fbdadf9b-68c8-4ff9-9370-235f0096ea91',
        name: 'Tecnologia',
      },
      {
        id: 'fdeec43e-fb4c-4c10-b356-d0e1d0df3e9b',
        name: 'Restaurante',
      },
    ];
  },

  createStore: async ({ name }: { name: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: '1',
      name: name,
    };
  },

  createPayment: async ({ name }: { name: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: '1',
      name: name,
    };
  },

  createGroup: async ({ name }: { name: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: '1',
      name: name,
    };
  },

  createCoupon: async (data: Coupom) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      data,
    };
  },
};
