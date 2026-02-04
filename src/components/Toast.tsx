import { Info, TriangleAlert, CircleAlert, CircleCheck, X } from 'lucide-react';
import { IconButton } from './Button';
import { useEffect } from 'react';

const typeClasses = {
  info: 'bg-blue-600',
  warning: 'bg-orange-600',
  error: 'bg-red-600',
  success: 'bg-green-600',
};

export default function Toast({
  message,
  detail,
  type = 'info',
  open,
  onClose,
}: {
  message: string;
  detail?: string;
  type?: 'error' | 'info' | 'success' | 'warning';
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className={`${typeClasses[type]} px-3 py-2 absolute bottom-6 right-6 rounded-md w-1/3 flex items-center gap-3 shadow-md`}
        >
          {type === 'info' && (
            <Info className="inline text-stone-50" data-testid="info-icon" />
          )}
          {type === 'warning' && (
            <TriangleAlert
              className="inline text-stone-50"
              data-testid="warning-icon"
            />
          )}
          {type === 'error' && (
            <CircleAlert
              className="inline text-stone-50"
              data-testid="error-icon"
            />
          )}
          {type === 'success' && (
            <CircleCheck
              className="inline text-stone-50"
              data-testid="success-icon"
            />
          )}
          <div className="flex flex-col flex-1">
            <p className="text-stone-50 w-full text-lg">{message || ''}</p>
            {detail && <p className="text-stone-100 text-sm">{detail}</p>}
          </div>

          <IconButton
            icon={<X color="#fff" />}
            variant="ghost"
            onClick={onClose}
          />
        </div>
      )}
    </>
  );
}
