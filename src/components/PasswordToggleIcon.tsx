import { Eye, EyeOff } from 'lucide-react';
import { IconButton } from './Button';

export default function PasswordToggleIcon({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return visible ? (
    <IconButton
      onClick={onToggle}
      icon={<EyeOff className="inline text-stone-500" />}
      variant="ghost"
      label="hide password"
    />
  ) : (
    <IconButton
      onClick={onToggle}
      icon={<Eye className="inline text-stone-500" />}
      variant="ghost"
      label="show password"
    />
  );
}
