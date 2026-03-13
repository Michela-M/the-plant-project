import { Callout } from './Typography';

export default function Menu({
  children,
  label,
}: Readonly<{ children: React.ReactNode; label: string }>) {
  return (
    <div
      role="menu"
      aria-label={label}
      className="absolute bg-stone-50 shadow-md rounded-md mt-2 right-0 min-w-48 max-w-[20rem] w-max z-10"
    >
      {children}
    </div>
  );
}

export function MenuItem({
  label,
  description,
  onClick,
  disabled,
  danger,
}: Readonly<{
  label: string;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}>) {
  return (
    <button
      role="menuitem"
      className={`w-full text-left px-3 py-2 overflow-hidden text-ellipsis whitespace-nowrap truncate ${disabled ? 'text-stone-400 cursor-not-allowed' : 'hover:bg-stone-100'} ${danger ? 'text-red-700' : ''} focus-visible:outline-2 focus-visible:outline-green-800 rounded-sm`}
      onClick={onClick}
      aria-disabled={disabled}
    >
      {danger && <span className="sr-only">(destructive action)</span>}
      {label}
      {description && (
        <Callout
          className={`${disabled ? 'text-stone-400' : 'text-stone-500'}`}
        >
          {description}
        </Callout>
      )}
    </button>
  );
}
