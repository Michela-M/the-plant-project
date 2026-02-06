import type { ReactNode } from 'react';

const variantClasses = {
  primary: {
    filled: 'bg-green-800 text-stone-50 hover:bg-green-900 active:bg-green-950',
    outlined:
      'text-green-800 bg-stone-50 border-2 border-green-800 hover:bg-green-800/10 active:bg-green-800/20',
    ghost: 'text-green-800 hover:bg-green-800/10 active:bg-green-800/20',
  },
  error: {
    filled: 'bg-red-800 text-stone-50 hover:bg-red-900 active:bg-red-950',
    outlined:
      'text-red-800 bg-stone-50 border-2 border-red-800 hover:bg-red-800/10 active:bg-red-800/20',
    ghost: 'text-red-800 hover:bg-red-800/10 active:bg-red-800/20',
  },
};

export default function Button({
  label,
  icon,
  variant = 'filled',
  tone = 'primary',
  onClick,
  type = 'button',
}: {
  label: string;
  icon?: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  tone?: 'primary' | 'error';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-3 py-2 rounded-md flex items-center justify-center ${variantClasses[tone][variant]}`}
    >
      {label}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
}

export function IconButton({
  icon,
  variant = 'filled',
  onClick,
  label,
}: {
  icon: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md ${variantClasses['primary'][variant]}`}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
