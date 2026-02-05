import { Eye, EyeOff } from 'lucide-react';

export default function PasswordToggleIcon({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return visible ? (
    <EyeOff
      onClick={onToggle}
      className="cursor-pointer"
      aria-label="Hide password"
    />
  ) : (
    <Eye
      onClick={onToggle}
      className="cursor-pointer"
      aria-label="Show password"
    />
  );
}
