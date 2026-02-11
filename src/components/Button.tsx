import type { ReactNode } from 'react';

const variantClasses = {
  primary: {
    filled:
      'bg-green-800 text-stone-50 hover:bg-green-900 active:bg-green-950 border-green-800',
    outlined:
      'text-green-800 bg-stone-50 border-green-800 hover:bg-green-800/10 active:bg-green-800/20',
    ghost:
      'text-green-800 hover:bg-green-800/10 active:bg-green-800/20 border-transparent',
  },
  error: {
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
}: {
  label: string;
  icon?: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  tone?: 'primary' | 'error';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={` flex items-center justify-center ${variantClasses[tone][variant]} ${size === 'sm' ? 'text-sm px-2 py-1 rounded-sm border gap-1' : 'text-md px-3 py-2 rounded-md border-2 gap-2'}`}
    >
      {label}
      {icon && (
        <span
          className={`flex items-center ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`}
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
}: {
  icon: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  onClick?: () => void;
  label?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${variantClasses['primary'][variant]} ${size === 'sm' ? 'p-1 rounded-sm border' : 'p-2 rounded-md border-2'}`}
      aria-label={label}
    >
      {icon && (
        <span
          className={`flex items-center ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`}
        >
          {icon}
        </span>
      )}
    </button>
  );
}
