import { create } from "zustand";

type AlertType = "success" | "error" | "warning" | "info" | "confirmation";

export interface Alert {
  description?: string;
  title?: string;
  type: AlertType;
  duration?: number;
  icon?: React.ReactNode | string;
  iconSize?: number;
  onConfirm?: () => void;
  confirmName?: string;
  cancelName?: string;
  message?: string;
}

interface AlertStore {
  alert: Alert | null;
  showAlert: (options: Alert) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alert: null,
  showAlert: (alert) => set({ alert }),
  hideAlert: () => set({ alert: null }),
}));
