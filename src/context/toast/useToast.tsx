import { createContext, useContext } from 'react';

type ToastType = 'error' | 'info' | 'success' | 'warning';

export interface ToastContextValue {
  showToast: (message: string, detail?: string, type?: ToastType) => void;
  showSuccess: (message: string, detail?: string) => void;
  showError: (message: string, detail?: string) => void;
  closeToast: () => void;
  toast: {
    message: string;
    detail?: string;
    type: ToastType;
    open: boolean;
  };
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
