interface IconOption {
  Icon: React.ComponentType<{ color: string }>;
  id?: string | number;
}

interface ButtonRadioProps {
  icons: IconOption[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export default function ButtonRadio({
  icons,
  selectedIndex,
  onChange,
}: ButtonRadioProps) {
  return (
    <div className="border border-stone-200 rounded-sm p-1 flex gap-1 items-center">
      {icons.map((iconOption, index) => {
        const isSelected = selectedIndex === index;
        const color = isSelected ? '#166534' : '#9CA3AF'; // green-800 / gray-400

        return (
          <button
            key={iconOption.id ?? index}
            onClick={() => onChange(index)}
            className={`p-1 cursor-pointer rounded-sm  ${
              isSelected ? 'border border-green-800 border-2' : ''
            }`}
          >
            <iconOption.Icon color={color} />
          </button>
        );
      })}
    </div>
  );
}
