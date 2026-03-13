const colorMap = {
  black: 'bg-stone-950',
  red: 'bg-red-400',
  orange: 'bg-orange-400',
  yellow: 'bg-yellow-400',
  lime: 'bg-lime-400',
  green: 'bg-green-400',
  cyan: 'bg-cyan-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  pink: 'bg-pink-400',
};

export default function IconTile({
  Icon,
  color = 'black',
  label,
}: Readonly<{
  Icon: React.ElementType;
  color?:
    | 'black'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'cyan'
    | 'blue'
    | 'purple'
    | 'pink';
  label: string;
}>) {
  return (
    <div
      className={`rounded-full w-10 h-10 flex items-center justify-center ${colorMap[color]}`}
      data-testid={`icon-${label}`}
      title={label}
      aria-hidden="true"
    >
      <Icon className="w-6 h-6 text-stone-50" />
    </div>
  );
}
