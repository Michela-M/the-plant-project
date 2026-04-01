import { ChevronDown, SquareX } from 'lucide-react';
import { IconButton } from '../Button';
import clsx from 'clsx';

export function ComboBoxInput({
  value,
  placeholder,
  readOnly,
  onFocus,
  onBlur,
  onChange,
  onToggle,
  onClear,
}: Readonly<{
  value: string;
  placeholder: string;
  readOnly: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (v: string) => void;
  onToggle: () => void;
  onClear: () => void;
}>) {
  return (
    <div className="relative">
      <input
        id="combo-input"
        role="combobox"
        aria-expanded={false}
        aria-controls="combo-listbox"
        type="text"
        value={value}
        placeholder={placeholder}
        className={clsx(
          'px-3 py-2 pr-11 rounded-md w-full border placeholder-stone-400 transition-colors focus:outline-green-800 focus:outline-2 focus:outline-offset-2 border-stone-300 hover:border-stone-500',
          readOnly && 'cursor-pointer bg-stone-50'
        )}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        readOnly={readOnly}
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <IconButton
          onClick={value === '' ? onToggle : onClear}
          label={value === '' ? 'Toggle options' : 'Clear selection'}
          icon={value === '' ? <ChevronDown /> : <SquareX />}
          variant="ghost"
          size="sm"
        />
      </div>
    </div>
  );
}
