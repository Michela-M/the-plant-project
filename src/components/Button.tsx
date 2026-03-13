import type { ReactNode } from 'react';
import { InlineSpinner } from './Spinner';

type ButtonVariant = 'filled' | 'outlined' | 'ghost';
type ButtonTone = 'primary' | 'destructive';
type ButtonSize = 'sm' | 'md';
type ButtonType = 'button' | 'submit' | 'reset';

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

const focusClasses = {
  primary:
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-700',
  destructive:
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-700',
};

function getSpinnerColor(variant: ButtonVariant, tone: ButtonTone) {
  if (variant === 'filled') {
    return 'stone-50';
  }

  return tone === 'primary' ? 'green-800' : 'red-800';
}

export default function Button({
  label,
  icon,
  variant = 'filled',
  tone = 'primary',
  onClick,
  type = 'button',
  size = 'md',
  loading = false,
  fullWidth = false,
  ariaLabel,
  ariaControls,
}: Readonly<{
  label: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  onClick?: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaControls?: string;
}>) {
  const spinnerColor = getSpinnerColor(variant, tone);

  return (
    <button
      type={type}
      onClick={loading ? undefined : onClick}
      className={`relative flex items-center justify-center ${variantClasses[tone][variant]} ${focusClasses[tone]} ${size === 'sm' ? 'text-sm px-2 py-1 rounded-sm border gap-1' : 'px-3 py-2 rounded-md border-2 gap-2'} ${fullWidth ? 'w-full' : ''}`}
      disabled={loading}
      aria-busy={loading}
      aria-label={
        loading ? `Loading ${ariaLabel ?? label}` : (ariaLabel ?? label)
      }
      aria-controls={ariaControls}
    >
      {loading && (
        <span className="absolute" aria-hidden="true">
          <InlineSpinner color={spinnerColor} />
        </span>
      )}
      <span
        className={loading ? 'opacity-0' : 'opacity-100'}
        aria-hidden={loading}
      >
        {' '}
        {label}{' '}
      </span>
      {icon && (
        <span
          className={`flex items-center justify-center ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${loading ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden={loading}
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
  tone = 'primary',
}: Readonly<{
  icon: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  label: string;
  size?: ButtonSize;
  loading?: boolean;
  tone?: ButtonTone;
}>) {
  const spinnerColor = getSpinnerColor(variant, tone);

  return (
    <button
      type="button"
      onClick={loading ? undefined : onClick}
      disabled={loading}
      aria-busy={loading}
      className={`${variantClasses[tone][variant]} ${focusClasses[tone]} ${size === 'sm' ? 'p-1 rounded-sm border' : 'p-2 rounded-md border-2'}`}
      aria-label={loading ? `Loading ${label}` : label}
    >
      {loading ? (
        <span
          className={`flex items-center justify-center ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`}
        >
          <InlineSpinner color={spinnerColor} aria-hidden="true" />
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
