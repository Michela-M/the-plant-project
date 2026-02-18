import Button, { IconButton } from './Button';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  type: 'passive' | 'transactional' | 'destructive' | 'acknowledgement';
  label?: string;
  onConfirm?: () => void;
}

export default function Modal({
  title,
  children,
  onClose,
  type,
  label,
  onConfirm,
}: ModalProps) {
  const isDestructive = type === 'destructive';
  const isPassive = type === 'passive';
  const isAcknowledgement = type === 'acknowledgement';
  const showTwoButtons = !isPassive && !isAcknowledgement;

  const confirmLabel = label || (isAcknowledgement ? 'OK' : 'Confirm');
  const confirmHandler = onConfirm || onClose;

  const renderActions = () => {
    if (isPassive) return null;

    return (
      <div className="flex gap-2 justify-end mt-4">
        {showTwoButtons && (
          <Button
            label="Cancel"
            variant="outlined"
            onClick={onClose}
            tone={isDestructive ? 'destructive' : undefined}
          />
        )}
        <Button
          label={confirmLabel}
          onClick={confirmHandler}
          tone={isDestructive ? 'destructive' : undefined}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-stone-50 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <div className="absolute top-2 right-2">
          <IconButton
            icon={<X />}
            variant="ghost"
            onClick={onClose}
            label="close"
          />
        </div>

        <h2 className="text-2xl mb-4">{title}</h2>
        {children}
        {renderActions()}
      </div>
    </div>
  );
}
