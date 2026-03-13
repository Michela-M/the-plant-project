import { Info, TriangleAlert, CircleAlert, CircleCheck, X } from 'lucide-react';
import { IconButton } from './Button';
import { useCallback, useEffect, useRef } from 'react';
import { Callout, Headline } from './Typography';

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
}: Readonly<{
  message: string;
  detail?: string;
  type?: 'error' | 'info' | 'success' | 'warning';
  open: boolean;
  onClose: () => void;
}>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(onClose, 4000);
  }, [clearTimer, onClose]);

  useEffect(() => {
    if (!open) return;
    startTimer();
    return clearTimer;
  }, [open, startTimer, clearTimer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!open || !container) return;

    container.addEventListener('mouseenter', clearTimer);
    container.addEventListener('mouseleave', startTimer);
    container.addEventListener('focusin', clearTimer);
    container.addEventListener('focusout', startTimer);

    return () => {
      container.removeEventListener('mouseenter', clearTimer);
      container.removeEventListener('mouseleave', startTimer);
      container.removeEventListener('focusin', clearTimer);
      container.removeEventListener('focusout', startTimer);
    };
  }, [open, clearTimer, startTimer]);

  const role = type === 'error' || type === 'warning' ? 'alert' : 'status';

  return (
    <>
      {open && (
        <div
          ref={containerRef}
          role={role}
          aria-live={role === 'alert' ? 'assertive' : 'polite'}
          className={`${typeClasses[type]} px-3 py-2 fixed bottom-6 right-6 rounded-md w-1/3 flex items-center gap-3 shadow-md`}
        >
          {type === 'info' && (
            <Info
              aria-hidden="true"
              className="inline text-stone-50"
              data-testid="info-icon"
            />
          )}
          {type === 'warning' && (
            <TriangleAlert
              aria-hidden="true"
              className="inline text-stone-50"
              data-testid="warning-icon"
            />
          )}
          {type === 'error' && (
            <CircleAlert
              aria-hidden="true"
              className="inline text-stone-50"
              data-testid="error-icon"
            />
          )}
          {type === 'success' && (
            <CircleCheck
              aria-hidden="true"
              className="inline text-stone-50"
              data-testid="success-icon"
            />
          )}
          <div className="flex flex-col flex-1">
            <Headline className="text-stone-50 w-full">
              <span className="sr-only">{type}: </span>
              {message || ''}
            </Headline>
            {detail && <Callout className="text-stone-100">{detail}</Callout>}
          </div>
          <IconButton
            icon={<X aria-hidden="true" color="#fff" />}
            variant="ghost"
            onClick={onClose}
            label="Close notification"
          />
        </div>
      )}
    </>
  );
}
