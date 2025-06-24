import { AuthService } from "./auth";
import { CouponReaderService } from './couponReader';
import { ProfileService } from "./profile";
import { ResourcesService } from './resources';
import { RevenueService } from './revenue';
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
  getExpenses: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => ResourcesService.getExpenses({ page, limit, search }),

  confirmNewMonthIncomes: RevenueService.confirmNewMonthIncomes,
  getRepeatedIncomes: RevenueService.getRepeatedIncomes,
};