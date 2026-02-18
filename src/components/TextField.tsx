import clsx from 'clsx';

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'date';
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  name?: string;
  required?: boolean;
};

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
  required,
}: TextFieldProps) {
  const hasError = Boolean(error);

  const inputClasses = clsx(
    'px-3 py-2 rounded-md w-full border placeholder-stone-400 transition-colors',
    'focus:outline-green-800 focus:outline-2 focus:outline-offset-2',
    {
      // normal
      'border-stone-300 hover:border-stone-500': !hasError && !disabled,

      // error
      'border-red-700': hasError && !disabled,

      // disabled
      'bg-stone-200 cursor-not-allowed border-stone-300 hover:border-stone-300':
        disabled,

      // icon padding
      'pr-10': icon,
    }
  );

  const labelClasses = clsx('mb-1', {
    'text-stone-400': disabled,
  });

  const helperClasses = clsx('text-xs pt-1', {
    'text-stone-500': !hasError,
    'text-red-700': hasError,
    'text-stone-400': disabled,
  });

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={name} className={labelClasses} aria-required={required}>
          {label}
          {required && <span className="text-red-700">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder || label || 'Enter text'}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={hasError}
            aria-required={required}
            className={inputClasses}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder || label || 'Enter text'}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={hasError}
            className={inputClasses}
          />
        )}

        {icon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        )}
      </div>

      {(helperText || error) && (
        <p className={helperClasses}>{error || helperText}</p>
      )}
    </div>
  );
}
