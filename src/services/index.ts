import { AuthService } from "./auth";
import { couponReader } from "./couponReader";
import { ProfileService } from "./profile";
import { resources } from "./resources";

export const api = {
  profile: ProfileService.profile,
  completeProfile: ProfileService.completeProfile,
  login: AuthService.login,
  resources,
  couponReader,
};