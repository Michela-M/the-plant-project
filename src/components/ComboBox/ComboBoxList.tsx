import { type ComboBoxOption } from './types';

export function ComboBoxList({
  options,
  onSelect,
  selectedId,
}: Readonly<{
  options: ComboBoxOption[];
  onSelect: (o: ComboBoxOption) => void;
  selectedId?: string;
}>) {
  return (
    <div
      id="combo-listbox"
      role="listbox"
      className="absolute z-10 mt-2 w-full shadow-lg border border-stone-300 rounded-md max-h-60 overflow-y-auto bg-white"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="option"
          aria-selected={selectedId === option.id}
          className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-stone-100"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(option);
          }}
        >
          {option.imageUrl && (
            <img
              src={option.imageUrl}
              alt={option.name}
              className="w-16 h-16 rounded-sm object-cover"
            />
          )}
          <span className="flex flex-col">
            {option.name}
            {option.description && (
              <span className="text-sm text-stone-500">
                {option.description}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
