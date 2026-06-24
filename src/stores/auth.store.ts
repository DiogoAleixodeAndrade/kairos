import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: AuthUser) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setIsLoading: (isLoading) => set({ isLoading }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));