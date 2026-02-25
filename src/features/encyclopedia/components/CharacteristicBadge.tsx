import IconTile from '@components/IconTile';
import { Skull, Sun, Wrench, Gauge } from 'lucide-react';
import PlantFlask from '@assets/icons/plant-flask.svg?react';
import Secateurs from '@assets/icons/secateurs.svg?react';

export default function CharacteristicBadge({
  label,
  value,
}: {
  label:
    | 'difficulty'
    | 'toxicity'
    | 'maintenance'
    | 'light'
    | 'pruning'
    | 'propagation';
  value: number;
}) {
  type CharacteristicValue = 0 | 1 | 2 | 3;
  const normalizedValue: CharacteristicValue =
    value >= 0 && value <= 3 ? (value as CharacteristicValue) : 0;

  const CHARACTERISTIC_CONFIG = {
    difficulty: {
      0: { text: null, color: 'black' },
      1: { text: 'Beginner-friendly', color: 'lime' },
      2: { text: 'Intermediate care', color: 'yellow' },
      3: { text: 'Expert level recommended', color: 'orange' },
    },
    toxicity: {
      0: { text: 'Non-toxic', color: 'lime' },
      1: { text: 'Toxic to pets', color: 'orange' },
      2: { text: 'Toxic to humans', color: 'orange' },
      3: { text: 'Toxic to pets & humans', color: 'red' },
    },
    maintenance: {
      0: { text: null, color: 'black' },
      1: { text: 'Low maintenance', color: 'lime' },
      2: { text: 'Moderate maintenance', color: 'yellow' },
      3: { text: 'High maintenance', color: 'orange' },
    },
    light: {
      0: { text: null, color: 'black' },
      1: { text: 'Low light', color: 'blue' },
      2: { text: 'Bright indirect light', color: 'yellow' },
      3: { text: 'Bright direct light', color: 'yellow' },
    },
    pruning: {
      0: { text: null, color: 'black' },
      1: { text: 'No pruning needed', color: 'lime' },
      2: { text: 'Occasional pruning recommended', color: 'yellow' },
      3: { text: 'Frequent pruning required', color: 'orange' },
    },
    propagation: {
      0: { text: null, color: 'black' },
      1: { text: 'Propagates easily', color: 'lime' },
      2: { text: 'Moderate propagation difficulty', color: 'yellow' },
      3: { text: 'Nearly impossible to propagate', color: 'orange' },
    },
  } as const;

  const config = CHARACTERISTIC_CONFIG[label][normalizedValue];

  // hide non-toxic categories when value = 0
  if (!config.text && label !== 'toxicity') return null;

  const colorClass = config.color;
  const text = config.text ?? '';

  let IconComponent;
  switch (label) {
    case 'difficulty':
      IconComponent = Gauge;
      break;
    case 'toxicity':
      IconComponent = Skull;
      break;
    case 'maintenance':
      IconComponent = Wrench;
      break;
    case 'light':
      IconComponent = Sun;
      break;
    case 'pruning':
      IconComponent = Secateurs;
      break;
    case 'propagation':
      IconComponent = PlantFlask;
      break;
  }

  return (
    <div className="flex items-center gap-2 pt-2">
      <IconTile Icon={IconComponent} color={colorClass} label={label} />
      <p>{text}</p>
    </div>
  );
}
