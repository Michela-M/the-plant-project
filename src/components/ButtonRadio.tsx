import clsx from 'clsx';
import { useId } from 'react';

interface IconOption {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id?: string | number;
  label: string;
}

interface ButtonRadioBaseProps {
  selectedIndex: number;
  onChange: (index: number) => void;
  disabled?: boolean;
  groupLabel: string;
}

type ButtonRadioProps =
  | (ButtonRadioBaseProps & {
      icons: IconOption[];
      labels?: never;
    })
  | (ButtonRadioBaseProps & {
      labels: string[];
      icons?: never;
    });

function getButtonClasses(isSelected: boolean, disabled?: boolean) {
  return clsx('rounded-sm transition-colors', {
    'text-stone-50 bg-stone-400 cursor-not-allowed': disabled && isSelected,

    'text-stone-400 cursor-not-allowed': disabled && !isSelected,

    'bg-green-800 text-stone-50 border-green-800': !disabled && isSelected,

    'text-green-800 border-transparent hover:bg-green-800/10 active:bg-green-800/20':
      !disabled && !isSelected,
  });
}

const focusClasses =
  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-green-800 has-[:focus-visible]:outline-offset-1';

export default function ButtonRadio({
  icons,
  labels,
  selectedIndex,
  onChange,
  disabled,
  groupLabel,
}: Readonly<ButtonRadioProps>) {
  const groupId = useId();
  const inputName = `button-radio-${groupId}`;

  return (
    <fieldset className="border border-stone-200 rounded-md p-1 flex gap-1">
      <legend className="sr-only">{groupLabel}</legend>
      {labels?.map((label, index) => (
        <label
          key={label}
          className={
            getButtonClasses(selectedIndex === index, disabled) +
            ` ${focusClasses}`
          }
        >
          <input
            type="radio"
            name={inputName}
            className="sr-only"
            checked={selectedIndex === index}
            disabled={disabled}
            onChange={() => onChange(index)}
          />
          {label}
        </label>
      ))}
      {icons?.map((option, index) => {
        const Icon = option.Icon;
        return (
          <label
            key={option.id ?? option.label}
            className={
              getButtonClasses(selectedIndex === index, disabled) +
              ` p-2 ${focusClasses}`
            }
          >
            <input
              type="radio"
              name={inputName}
              className="sr-only"
              checked={selectedIndex === index}
              disabled={disabled}
              onChange={() => onChange(index)}
              aria-label={option.label}
            />
            <Icon aria-hidden="true" />
          </label>
        );
      })}
    </fieldset>
  );
}
