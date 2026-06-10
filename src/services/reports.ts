import api from "./api";
import type { PaginatedWarrantyItems } from "../types/warrantyItems";

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

function buildQuery(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number | boolean] =>
      entry[1] !== undefined && entry[1] !== '',
  );
  return entries
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
}

export const ReportsService = {
  getExpenseByGroup: async ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }): Promise<ExpensesByGroup[]> => {
    const qs = buildQuery({ startDate, endDate, userId });
    const response = await api.get(`/reports/expense-by-group?${qs}`);
    return response.data;
  },

  getExpenseByStore: async ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }): Promise<ExpensesByStore[]> => {
    const qs = buildQuery({ startDate, endDate, userId });
    const response = await api.get(`/reports/expense-by-store?${qs}`);
    return response.data;
  },

  getExpenseByDate: async ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }): Promise<ExpensesByDate[]> => {
    const qs = buildQuery({ startDate, endDate, userId });
    const response = await api.get(`/reports/expense-by-date?${qs}`);
    return response.data;
  },

  getMostPurchasedItems: async ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }): Promise<PurchasedItems[]> => {
    const qs = buildQuery({ startDate, endDate, userId });
    const response = await api.get(`/reports/most-purchased-items?${qs}`);
    return response.data;
  },

  getExpensesIncomeComparison: async ({
    year,
    userId,
  }: {
    year: string;
    userId?: string;
  }): Promise<ExpensesIncomeComparison[]> => {
    const qs = buildQuery({ year, userId });
    const response = await api.get(`/reports/expenses-income-comparison?${qs}`);
    return response.data;
  },

  getWarrantyItems: async ({
    year,
    userId,
    search,
    includeExpired,
    page,
    limit,
  }: {
    year: string;
    userId?: string;
    search?: string;
    includeExpired?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedWarrantyItems> => {
    const qs = buildQuery({
      year,
      userId,
      search,
      includeExpired,
      page,
      limit,
    });
    const response = await api.get<PaginatedWarrantyItems>(
      `/reports/warranty-items?${qs}`,
    );
    return response.data;
  },
};
