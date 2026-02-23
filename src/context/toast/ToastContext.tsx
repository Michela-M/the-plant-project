import { useCallback, useMemo, useState } from 'react';
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

  const showToast = useCallback(
    (message: string, detail = '', type: ToastType = 'info') => {
      setToast({ message, detail, type, open: true });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, detail?: string) => showToast(message, detail, 'success'),
    [showToast]
  );

  const showError = useCallback(
    (message: string, detail?: string) => showToast(message, detail, 'error'),
    [showToast]
  );

  const closeToast = useCallback(
    () => setToast((prev) => ({ ...prev, open: false })),
    []
  );

  const value = useMemo(
    () => ({ showToast, showSuccess, showError, closeToast, toast }),
    [showToast, showSuccess, showError, closeToast, toast]
  );

  return (
    <ToastContext.Provider value={value}>
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
