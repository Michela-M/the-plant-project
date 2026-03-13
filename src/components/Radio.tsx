import { useId, useContext, createContext } from 'react';

const RadioGroupContext = createContext<string>('');

export default function RadioGroup({
  label,
  children,
  layout = 'vertical',
}: Readonly<{
  label: string;
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal';
}>) {
  const groupName = useId();

  return (
    <RadioGroupContext.Provider value={groupName}>
      <fieldset>
        <legend className="block mb-1">{label}</legend>
        <div
          className={
            layout === 'horizontal' ? 'flex flex-row' : 'flex flex-col'
          }
        >
          {children}
        </div>
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export function RadioButton({
  label,
  value,
  checked,
  onChange,
  disabled,
}: Readonly<{
  label: React.ReactNode;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}>) {
  const groupName = useContext(RadioGroupContext);
  const id = useId();
  const inputId = `${id}-${value}`;

  return (
    <div className="flex gap-1 w-full">
      <div className="grid place-items-center">
        <input
          type="radio"
          id={inputId}
          name={groupName}
          checked={checked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className={`peer col-start-1 row-start-1 appearance-none shrink-0 w-4 h-4 border-2 rounded-full ${disabled ? 'border-stone-400 cursor-not-allowed' : 'border-green-950'} focus-visible:outline-2 focus-visible:outline-green-800 focus-visible:outline-offset-1`}
        />
        <div
          className={`peer-checked:opacity-100 opacity-0 pointer-events-none col-start-1 row-start-1 w-2 h-2 rounded-full ${disabled ? 'bg-stone-400' : 'bg-green-950'}`}
        />
      </div>
      <label
        htmlFor={inputId}
        className={`${disabled ? 'text-stone-400 cursor-not-allowed' : ''}`}
      >
        {label}
      </label>
    </div>
  );
}
