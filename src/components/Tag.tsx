const COLOR_MAP = {
  grey: 'bg-stone-200 text-stone-700',
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  pink: 'bg-pink-100 text-pink-700',
} as const;

export default function Tag({
  label,
  color = 'grey',
}: {
  label: string;
  color?:
    | 'grey'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink';
}) {
  return (
    <div className={`text-xs px-2 py-1 rounded-sm ${COLOR_MAP[color]}`}>
      {label}
    </div>
  );
}
