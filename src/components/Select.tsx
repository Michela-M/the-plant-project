export default function Select({
  options,
  onSelect,
  label,
  name,
  id,
  value = '',
  error,
  onBlur,
}: {
  options: string[];
  onSelect: (option: string) => void;
  label: string;
  name?: string;
  id: string;
  value?: string;
  error?: string;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="mb-1">
        {label}
      </label>
      <select
        id={id}
        name={name}
        className={`px-3 py-2 rounded-md w-full border focus:outline-green-800 focus:outline-2 focus:outline-offset-2 ${error ? 'border-red-700' : 'border-stone-300 hover:border-stone-500'}`}
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        onBlur={onBlur}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-xs pt-1 text-red-700">{error}</p>}
    </div>
  );
}
