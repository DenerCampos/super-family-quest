import { AuthService } from "./auth";
import { couponReaderService } from './couponReader';
import { ProfileService } from "./profile";
import { resourcesService } from './resources';

export const api = {
  profile: ProfileService.profile,
  completeProfile: ProfileService.completeProfile,
  login: AuthService.login,
  couponReader: couponReaderService.read,
  getStores: resourcesService.getStores,
  getPayments: resourcesService.getPayments,
  getGroups: resourcesService.getGroups,
  createStore: resourcesService.createStore,
  createPayment: resourcesService.createPayment,
  createGroup: resourcesService.createGroup,
  createCoupon: resourcesService.createCoupon,
};