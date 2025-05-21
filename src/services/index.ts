import { AuthService } from "./auth";
import { profile } from "./profile";
import { resources } from "./resources";

export const api = {
  profile,
  login: AuthService.login,
  resources,
};