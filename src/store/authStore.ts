import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (nome: string, email: string, telefone?: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      login: async (email: string) => {
        set({ loading: true });
        const { user, token } = await authService.login({ email, senha: "" });
        set({ user, token, loading: false });
      },
      register: async (nome, email, telefone) => {
        set({ loading: true });
        const { user, token } = await authService.register({ nome, email, telefone, senha: "" });
        set({ user, token, loading: false });
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: "urbanize-auth" }
  )
);
