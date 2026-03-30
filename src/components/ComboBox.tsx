import { useState } from 'react';
import { SquareX } from 'lucide-react';
import { IconButton } from './Button';

export type ComboBoxSelection = Readonly<{
  id: string | null;
  name: string;
}>;

export type ComboBoxOption = Readonly<{
  id: string;
  name: string;
  description?: string;
  image?: string;
}>;

type ComboBoxProps = Readonly<{
  label?: string;
  value?: string;
  options: ComboBoxOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onSelectionChange?: (selection: ComboBoxSelection) => void;
}>;

export default function ComboBox({
  label,
  value = '',
  options,
  placeholder = 'Select or type a value',
  onChange,
  onBlur,
  onSelectionChange,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelect = (option: ComboBoxOption) => {
    onChange?.(option.name);
    onSelectionChange?.({ id: option.id, name: option.name });
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange?.('');
    onSelectionChange?.({ id: null, name: '' });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor="combo-input" className="mb-1 block">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id="combo-input"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="combo-listbox"
          type="text"
          value={value}
          placeholder={placeholder}
          className="px-3 py-2 pr-11 rounded-md w-full border placeholder-stone-400 transition-colors focus:outline-green-800 focus:outline-2 focus:outline-offset-2 border-stone-300 hover:border-stone-500"
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setIsOpen(false);
            onBlur?.();
          }}
          onChange={(e) => {
            const next = e.target.value;
            onChange?.(next);
            onSelectionChange?.({ id: null, name: next });
            setIsOpen(true);
          }}
        />
        {value && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <IconButton
              onClick={handleClear}
              label="Clear selection"
              icon={<SquareX />}
              variant="ghost"
              size="sm"
            />
          </div>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div
          id="combo-listbox"
          className="absolute z-10 mt-2 w-full shadow-lg border border-stone-300 rounded-md max-h-60 overflow-y-auto bg-white"
        >
          {filteredOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-stone-100"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
            >
              {option.image && (
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-16 h-16 rounded-sm object-cover"
                />
              )}
              <span className="flex flex-col">
                {option.description && (
                  <span className="text-sm text-stone-500">
                    {option.description}
                  </span>
                )}
                {option.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
