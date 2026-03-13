import clsx from 'clsx';
import { useId } from 'react';

type BaseTextFieldProps = {
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

type TextFieldProps =
  | (BaseTextFieldProps & {
      label: string;
      ariaLabel?: never;
    })
  | (BaseTextFieldProps & {
      label?: never;
      ariaLabel: string;
    });

export default function TextField({
  label,
  ariaLabel,
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
}: Readonly<TextFieldProps>) {
  const hasError = Boolean(error);

  const generatedId = useId();
  const inputId = name ?? generatedId;
  const descriptionId = `${inputId}-description`;

  const accessibleLabel = label ?? ariaLabel;

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
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-red-700">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {type === 'textarea' ? (
          <textarea
            id={inputId}
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
            id={inputId}
            name={name}
            type={type}
            aria-label={label ? undefined : ariaLabel}
            placeholder={placeholder ?? accessibleLabel ?? 'Enter text'}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-describedby={helperText || error ? descriptionId : undefined}
            aria-invalid={hasError}
            aria-required={required}
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
        <p
          id={descriptionId}
          className={helperClasses}
          role={hasError ? 'alert' : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
