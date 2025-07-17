import api from "./api";

export type ExpensesByGroup = {
  name: string;
  value: number;
};

export type ExpensesByStore = {
  name: string;
  value: number;
};

export type ExpensesByDate = {
  value: number;
  date: string;
};

export type PurchasedItems = {
  name: string;
  quantity: number;
  value: string;
};

export type ExpensesIncomeComparison = {
  month: string;
  totalExpenses: string;
  totalRevenues: string;
};

export const ReportsService = {
  getExpenseByGroup: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<ExpensesByGroup[]> => {
    const response = await api.get(
      `/reports/expense-by-group?startDate=${startDate}&endDate=${endDate}`,
    );

    return response.data;
  },

  getExpenseByStore: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<ExpensesByStore[]> => {
    const response = await api.get(
      `/reports/expense-by-store?startDate=${startDate}&endDate=${endDate}`,
    );

    return response.data;
  },

  getExpenseByDate: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<ExpensesByDate[]> => {
    const response = await api.get(
      `/reports/expense-by-date?startDate=${startDate}&endDate=${endDate}`,
    );

    return response.data;
  },

  getMostPurchasedItems: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<PurchasedItems[]> => {
    const response = await api.get(
      `/reports/most-purchased-items?startDate=${startDate}&endDate=${endDate}`,
    );

    return response.data;
  },

  getExpensesIncomeComparison: async ({
    year,
  }: {
    year: string;
  }): Promise<ExpensesIncomeComparison[]> => {
    const response = await api.get(
      `/reports/expenses-income-comparison?year=${year}`,
    );

    return response.data;
  },
};