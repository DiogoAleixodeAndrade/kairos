import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
};

type ToastState = {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: createId() }],
    })),

  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

// helper para chamar fora de componentes (services, catch, etc.)
export const toast = {
  success: (message: string, title?: string) =>
    useToastStore.getState().show({ type: "success", message, title }),
  error: (message: string, title?: string) =>
    useToastStore.getState().show({ type: "error", message, title }),
  info: (message: string, title?: string) =>
    useToastStore.getState().show({ type: "info", message, title }),
};
