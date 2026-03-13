import { Eye, EyeOff } from 'lucide-react';
import { IconButton } from './Button';

export default function PasswordToggleIcon({
  visible,
  onToggle,
}: Readonly<{
  visible: boolean;
  onToggle: () => void;
}>) {
  return (
    <IconButton
      size="sm"
      onClick={onToggle}
      icon={
        visible ? (
          <EyeOff className="inline text-stone-500" />
        ) : (
          <Eye className="inline text-stone-500" />
        )
      }
      variant="ghost"
      aria-pressed={visible}
      label={visible ? 'Hide password' : 'Show password'}
    />
  );
}
