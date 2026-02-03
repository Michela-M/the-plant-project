import type { ReactNode } from 'react';

const variantClasses = {
  filled: 'bg-green-800 text-stone-50 hover:bg-green-900 active:bg-green-950',
  outlined:
    'text-green-800 bg-stone-50 border-2 border-green-800 hover:bg-green-800/10 active:bg-green-800/20',
  ghost: 'text-green-800 hover:bg-green-800/10 active:bg-green-800/20',
};

export default function Button({
  label,
  variant = 'filled',
  onClick,
  type,
}: {
  label: string;
  variant?: 'filled' | 'outlined' | 'ghost';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-3 py-2 rounded-md ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}

export function IconButton({
  icon,
  variant = 'filled',
  onClick,
}: {
  icon: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md ${variantClasses[variant]}`}
    >
      {icon}
    </button>
  );
}
