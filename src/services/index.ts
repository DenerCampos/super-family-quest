import { AuthService } from "./auth";
import { CouponReaderService } from './couponReader';
import { ProfileService } from "./profile";
import { ResourcesService } from './resources';
import { RevenueService } from './revenue';
import { UserService } from "./user";

export const api = {
  profile: ProfileService.profile,
  completeProfile: ProfileService.completeProfile,
  login: AuthService.login,
  register: UserService.register,
  updateUser: UserService.update,
  couponReader: CouponReaderService.read,
  getStores: ResourcesService.getStores,
  getPayments: ResourcesService.getPayments,
  getGroups: ResourcesService.getGroups,
  createStore: ResourcesService.createStore,
  createPayment: ResourcesService.createPayment,
  createGroup: ResourcesService.createGroup,
  createCoupon: ResourcesService.createCoupon,
  confirmNewMonthIncomes: RevenueService.confirmNewMonthIncomes,
  getRepeatedIncomes: RevenueService.getRepeatedIncomes,
  getLatestRegistrations: (limit?: number) =>
    UserService.getLatestRegistrations(limit),
};