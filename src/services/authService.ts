import { api } from "./api";
import { AuthPayload, RegisterPayload } from "@/types/auth";
import { User } from "@/types/user";

export const authService = {
  login: ({ email }: AuthPayload) => api.login(email),
  register: ({ nome, email, telefone }: RegisterPayload): Promise<{ user: User; token: string }> =>
    api.register(nome, email, "cidadao", telefone),
};
