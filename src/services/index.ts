import { AuthService } from "./auth";
import { CouponReaderService } from './couponReader';
import { ExpenseService, type ExpenseRecurring } from "./expense";
import { ProfileService } from "./profile";
import { ReportsService } from "./reports";
import { ResourcesService, type UpdateExpense } from './resources';
import { RevenueService, type RevenueRecurring } from './revenue';
import { UserService } from "./user";

export const api = {
  profile: ProfileService.profile,
  completeProfile: ProfileService.completeProfile,
  getLatestRegistrations: (limit?: number) =>
    ProfileService.getLatestRegistrations(limit),

  login: AuthService.login,
  register: UserService.register,
  updateUser: UserService.update,

  couponReader: CouponReaderService.read,

  getStores: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => ResourcesService.getStores({ page, limit, search }),
  getPayments: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => ResourcesService.getPayments({ page, limit, search }),
  getGroups: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => ResourcesService.getGroups({ page, limit, search }),
  createStore: ResourcesService.createStore,
  createPayment: ResourcesService.createPayment,
  createGroup: ResourcesService.createGroup,
  createExpense: ResourcesService.createExpense,
  updateExpense: (id: string, data: UpdateExpense) =>
    ResourcesService.updateExpense(id, data),
  getExpenses: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => ResourcesService.getExpenses({ page, limit, search }),
  updateStore: ({ id, name }: { id: string; name: string }) =>
    ResourcesService.updateStore({ id, name }),
  updatePayment: ({ id, name }: { id: string; name: string }) =>
    ResourcesService.updatePayment({ id, name }),
  updateGroup: ({ id, name }: { id: string; name: string }) =>
    ResourcesService.updateGroup({ id, name }),
  deleteStore: ({ id }: { id: string }) => ResourcesService.deleteStore({ id }),
  deletePayment: ({ id }: { id: string }) =>
    ResourcesService.deletePayment({ id }),
  deleteGroup: ({ id }: { id: string }) => ResourcesService.deleteGroup({ id }),
  deleteExpense: ({ id }: { id: string }) =>
    ResourcesService.deleteExpense({ id }),
  createRevenue: ResourcesService.createRevenue,
  getRevenues: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => ResourcesService.getRevenues({ page, limit, search }),
  updateRevenue: ResourcesService.updateRevenue,
  deleteRevenue: ({ id }: { id: string }) =>
    ResourcesService.deleteRevenue({ id }),

  recurringIncomeConfirm: (revenues: RevenueRecurring) =>
    RevenueService.postRecurringConfirm(revenues),
  getIncomeRecurring: RevenueService.getRecurring,

  getExpenseByGroup: ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => ReportsService.getExpenseByGroup({ startDate, endDate }),
  getExpenseByStore: ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => ReportsService.getExpenseByStore({ startDate, endDate }),
  getExpenseByDate: ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => ReportsService.getExpenseByDate({ startDate, endDate }),
  getMostPurchasedItems: ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => ReportsService.getMostPurchasedItems({ startDate, endDate }),
  getExpensesIncomeComparison: ({
    year,
  }: {
    year: string;
  }) => ReportsService.getExpensesIncomeComparison({ year }),
  recurringExpenseConfirm: (expenses: ExpenseRecurring) =>
    ExpenseService.postRecurringConfirm(expenses),
  getExpenseRecurring: ExpenseService.getRecurring,
};