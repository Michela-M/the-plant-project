import clsx from 'clsx';

interface IconOption {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id?: string | number;
}

interface ButtonRadioProps {
  icons?: IconOption[];
  labels?: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  disabled?: boolean;
}

function getButtonClasses(isSelected: boolean, disabled?: boolean) {
  return clsx('rounded-sm transition-colors', {
    'text-stone-50 bg-stone-400 cursor-not-allowed': disabled && isSelected,

    'text-stone-400 cursor-not-allowed': disabled && !isSelected,

    'bg-green-800 text-stone-50 border-green-800': !disabled && isSelected,

    'text-green-800 border-transparent hover:bg-green-800/10 active:bg-green-800/20':
      !disabled && !isSelected,
  });
}

export default function ButtonRadio({
  icons,
  labels,
  selectedIndex,
  onChange,
  disabled,
}: ButtonRadioProps) {
  return (
    <div
      role="tablist"
      className="border border-stone-200 rounded-md p-1 flex gap-1"
    >
      {icons &&
        icons.map((option, index) => {
          const Icon = option.Icon;
          return (
            <button
              key={option.id || index}
              role="tab"
              aria-selected={selectedIndex === index}
              onClick={() => onChange(index)}
              disabled={disabled}
              className={
                getButtonClasses(selectedIndex === index, disabled) + ' p-2'
              }
            >
              <Icon />
            </button>
          );
        })}
      {!icons &&
        labels?.map((label, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={selectedIndex === index}
            onClick={() => onChange(index)}
            disabled={disabled}
            className={
              getButtonClasses(selectedIndex === index, disabled) + ' px-3 py-2'
            }
          >
            {label}
          </button>
        ))}
    </div>
  );
}
