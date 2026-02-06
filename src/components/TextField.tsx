import clsx from 'clsx';

export default function TextField({
  label,
  placeholder,
  helperText,
  disabled = false,
  icon,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  name,
}: {
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'text' | 'password' | 'email';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={name}
          className={clsx('mb-1', {
            'text-stone-400': disabled,
          })}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder || label || 'Enter text'}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          className={clsx(
            'px-3 py-2 rounded-md w-full placeholder-stone-400 border transition-colors focus:outline-green-800',
            {
              // normal
              'border-stone-300 hover:border-stone-500 focus:outline-2 focus:outline-offset-2 ':
                !error && !disabled,

              // error
              'border-red-700': error && !disabled,

              // disabled
              'bg-stone-200 cursor-not-allowed border-stone-300 hover:border-stone-300':
                disabled,

              // icon padding
              'pr-10': icon,
            }
          )}
        />

        {icon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        )}
      </div>

      {(helperText || error) && (
        <p
          className={clsx('text-xs pt-1', {
            'text-stone-500': !error,
            'text-red-700': error,
            'text-stone-400': disabled,
          })}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
