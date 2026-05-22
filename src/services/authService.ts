import { api } from "./api";
import { AuthPayload, RegisterPayload } from "@/types/auth";
import { User } from "@/types/user";

export const authService = {
  login: (payload: AuthPayload) => api.login(payload),
  register: (payload: RegisterPayload): Promise<{ user: User; token: string }> => api.register(payload),
  me: () => api.me(),
  logout: () => api.logout(),
};
