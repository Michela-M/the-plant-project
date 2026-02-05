import { useState, useCallback } from 'react';

export type ToastType = 'info' | 'error' | 'success' | 'warning';

export interface ToastState {
  message: string;
  detail: string;
  type: ToastType;
  open: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    detail: '',
    type: 'info',
    open: false,
  });

  const showToast = useCallback(
    (message: string, type: ToastType, detail = '') => {
      setToast({ message, detail, type, open: true });
    },
    []
  );

  const showSuccessToast = useCallback(
    (message: string, detail?: string) => {
      showToast(message, 'success', detail);
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (message: string, detail?: string) => {
      showToast(message, 'error', detail);
    },
    [showToast]
  );

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    toast,
    showToast,
    showSuccessToast,
    showErrorToast,
    closeToast,
  };
}
