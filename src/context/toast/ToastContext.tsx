import { useState } from 'react';
import Toast from '@components/Toast';
import { ToastContext } from './useToast';

type ToastType = 'error' | 'info' | 'success' | 'warning';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState({
    message: '',
    detail: '',
    type: 'info' as ToastType,
    open: false,
  });

  const showToast = (
    message: string,
    detail = '',
    type: ToastType = 'info'
  ) => {
    setToast({ message, detail, type, open: true });
  };

  const showSuccess = (message: string, detail?: string) =>
    showToast(message, detail, 'success');

  const showError = (message: string, detail?: string) =>
    showToast(message, detail, 'error');

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, closeToast, toast }}
    >
      {children}
      <Toast
        message={toast.message}
        detail={toast.detail}
        type={toast.type}
        open={toast.open}
        onClose={closeToast}
      />
    </ToastContext.Provider>
  );
}
