import type { ComboBoxOption, ComboBoxSelection } from './types';
import { useMemo, useState } from 'react';
import { ComboBoxInput } from './ComboBoxInput';
import { ComboBoxList } from './ComboBoxList';

type ComboBoxProps = Readonly<{
  label?: string;
  value?: string;
  options: ComboBoxOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onSelectionChange?: (selection: ComboBoxSelection) => void;
  readOnly?: boolean;
}>;

export default function ComboBox({
  label,
  value = '',
  options,
  placeholder = 'Select or type a value',
  onChange,
  onBlur,
  onSelectionChange,
  readOnly = false,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filteredOptions = useMemo(
    () =>
      options.filter((o) => o.name.toLowerCase().includes(value.toLowerCase())),
    [options, value]
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

      <ComboBoxInput
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setIsOpen(false);
          onBlur?.();
        }}
        onChange={(next) => {
          onChange?.(next);
          onSelectionChange?.({ id: null, name: next });
          setIsOpen(true);
        }}
        onToggle={() => setIsOpen((o) => !o)}
        onClear={handleClear}
      />

      {isOpen && filteredOptions.length > 0 && (
        <ComboBoxList options={filteredOptions} onSelect={handleSelect} />
      )}
    </div>
  );
}
