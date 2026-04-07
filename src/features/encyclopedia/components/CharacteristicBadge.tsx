import PlantFlask from '@assets/icons/plant-flask.svg?react';
import Secateurs from '@assets/icons/secateurs.svg?react';
import Star1 from '@assets/icons/star-1.svg?react';
import Star2 from '@assets/icons/star-2.svg?react';
import Star3 from '@assets/icons/star-3.svg?react';
import IconTile from '@components/IconTile';
import { Cat, Skull, Sun, SunDim, SunMedium, Wrench } from 'lucide-react';

const CHARACTERISTIC_CONFIG = {
  difficulty: {
    0: { text: null, color: 'black', icon: null },
    1: { text: 'Beginner-friendly', color: 'lime', icon: Star1 },
    2: { text: 'Intermediate care', color: 'blue', icon: Star2 },
    3: { text: 'Expert level recommended', color: 'red', icon: Star3 },
  },
  toxicity: {
    0: { text: 'Non-toxic', color: 'lime', icon: Cat },
    1: { text: 'Toxic to pets', color: 'black', icon: Skull },
    2: { text: 'Toxic to humans', color: 'black', icon: Skull },
    3: { text: 'Toxic to pets & humans', color: 'red', icon: Skull },
  },
  maintenance: {
    0: { text: null, color: 'black', icon: null },
    1: { text: 'Low maintenance', color: 'lime', icon: Wrench },
    2: { text: 'Moderate maintenance', color: 'yellow', icon: Wrench },
    3: { text: 'High maintenance', color: 'orange', icon: Wrench },
  },
  light: {
    0: { text: null, color: 'black', icon: null },
    1: { text: 'Low light', color: 'blue', icon: SunDim },
    2: { text: 'Bright indirect light', color: 'orange', icon: SunMedium },
    3: { text: 'Bright direct light', color: 'yellow', icon: Sun },
  },
  pruning: {
    0: { text: null, color: 'black', icon: null },
    1: { text: 'No pruning needed', color: 'lime', icon: Secateurs },
    2: {
      text: 'Occasional pruning recommended',
      color: 'yellow',
      icon: Secateurs,
    },
    3: {
      text: 'Frequent pruning required',
      color: 'orange',
      icon: Secateurs,
    },
  },
  propagation: {
    0: { text: null, color: 'black', icon: null },
    1: { text: 'Propagates easily', color: 'lime', icon: PlantFlask },
    2: {
      text: 'Moderate propagation difficulty',
      color: 'yellow',
      icon: PlantFlask,
    },
    3: {
      text: 'Nearly impossible to propagate',
      color: 'orange',
      icon: PlantFlask,
    },
  },
} as const;

export default function CharacteristicBadge({
  label,
  value,
}: Readonly<{
  label:
    | 'difficulty'
    | 'toxicity'
    | 'maintenance'
    | 'light'
    | 'pruning'
    | 'propagation';
  value: number;
}>) {
  type CharacteristicValue = 0 | 1 | 2 | 3;
  const normalizedValue: CharacteristicValue =
    value >= 0 && value <= 3 ? (value as CharacteristicValue) : 0;

  const config = CHARACTERISTIC_CONFIG[label][normalizedValue];

  // hide non-toxic categories when value = 0
  if (!config.text && label !== 'toxicity') return null;

  const colorClass = config.color;
  const text = config.text;
  const iconComponent = config.icon ?? Star3;

  return (
    <div className="flex items-center gap-2 pt-2">
      <IconTile Icon={iconComponent} color={colorClass} label={label} />
      <p>{text}</p>
    </div>
  );
}
