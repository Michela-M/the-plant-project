export default function RadioGroup({
  label,
  children,
  layout = 'vertical',
}: {
  label?: string;
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal';
}) {
  return (
    <div aria-label={label ? `${label} radio group` : 'Radio group'}>
      {label}
      <div
        className={layout === 'horizontal' ? 'flex flex-row' : 'flex flex-col'}
      >
        {children}
      </div>
    </div>
  );
}

export function RadioButton({
  label,
  value,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1 w-full">
      <div className="grid place-items-center">
        <input
          type="radio"
          id={value}
          name={value}
          checked={checked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className={`peer col-start-1 row-start-1 appearance-none shrink-0 w-4 h-4 border-2 rounded-full ${disabled ? 'border-stone-400 cursor-not-allowed' : 'border-green-950'} `}
        />
        <div
          className={`peer-checked:opacity-100 opacity-0 pointer-events-none col-start-1 row-start-1 w-2 h-2 rounded-full ${disabled ? 'bg-stone-400' : 'bg-green-950'}`}
        />
      </div>
      <label
        htmlFor={value}
        className={`${disabled ? 'text-stone-400 cursor-not-allowed' : ''}`}
      >
        {label}
      </label>
    </div>
  );
}
