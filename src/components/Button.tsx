import type { ReactNode } from 'react';
import { InlineSpinner } from './Spinner';

const variantClasses = {
  primary: {
    filled:
      'bg-green-800 text-stone-50 hover:bg-green-900 active:bg-green-950 border-green-800',
    outlined:
      'text-green-800 bg-stone-50 border-green-800 hover:bg-green-800/10 active:bg-green-800/20',
    ghost:
      'text-green-800 hover:bg-green-800/10 active:bg-green-800/20 border-transparent',
  },
  destructive: {
    filled:
      'bg-red-800 text-stone-50 hover:bg-red-900 active:bg-red-950 border-red-800',
    outlined:
      'text-red-800 bg-stone-50 border-red-800 hover:bg-red-800/10 active:bg-red-800/20',
    ghost:
      'text-red-800 hover:bg-red-800/10 active:bg-red-800/20 border-transparent',
  },
};

export default function Button({
  label,
  icon,
  variant = 'filled',
  tone = 'primary',
  onClick,
  type = 'button',
  size = 'md',
  loading = false,
}: {
  label: string;
  icon?: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  tone?: 'primary' | 'destructive';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md';
  loading?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative flex items-center justify-center ${variantClasses[tone][variant]} ${size === 'sm' ? 'text-sm px-2 py-1 rounded-sm border gap-1' : 'text-md px-3 py-2 rounded-md border-2 gap-2'}`}
      disabled={loading}
      aria-busy={loading}
    >
      {loading && (
        <span className="absolute">
          <InlineSpinner
            color={
              variant === 'filled'
                ? 'stone-50'
                : tone === 'primary'
                  ? 'green-800'
                  : 'red-800'
            }
          />
        </span>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}> {label} </span>
      {icon && (
        <span
          className={`flex items-center justify-center ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${loading ? 'opacity-0' : 'opacity-100'}`}
        >
          {icon}
        </span>
      )}
    </button>
  );
}

export function IconButton({
  icon,
  variant = 'filled',
  onClick,
  label,
  size = 'md',
  loading = false,
}: {
  icon: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  onClick?: () => void;
  label?: string;
  size?: 'sm' | 'md';
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={loading ? undefined : onClick}
      disabled={loading}
      aria-busy={loading}
      className={`${variantClasses['primary'][variant]} ${size === 'sm' ? 'p-1 rounded-sm border' : 'p-2 rounded-md border-2'}`}
      aria-label={label}
    >
      {loading ? (
        <span
          className={`flex items-center justify-center ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`}
        >
          <InlineSpinner
            color={variant === 'filled' ? 'stone-50' : 'green-800'}
          />
        </span>
      ) : (
        <span
          className={`flex items-center justify-center ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`}
        >
          {icon}
        </span>
      )}
    </button>
  );
}
