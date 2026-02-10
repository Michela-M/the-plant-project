export default function Menu({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bg-stone-50 shadow-md rounded-md mt-2 left-0 min-w-48 max-w-[20rem] w-max z-10">
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
}: {
  label: string;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      className={`w-full text-left px-3 py-2  overflow-hidden text-ellipsis whitespace-nowrap truncate ${disabled ? 'text-stone-400 cursor-not-allowed' : 'hover:bg-stone-100'} ${danger ? 'text-red-700' : ''}`}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      {label}
      {description && (
        <p
          className={`text-sm ${disabled ? 'text-stone-400' : 'text-stone-500'}`}
        >
          {description}
        </p>
      )}
    </button>
  );
}
