import { AuthService } from "./auth";
import { profile } from "./profile";

export const api = {
  profile,
  login: AuthService.login
}