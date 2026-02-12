import Button, { IconButton } from './Button';
import { X } from 'lucide-react';

export default function Modal({
  title,
  children,
  onClose,
  type,
  label,
  onConfirm,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  type: 'passive' | 'transactional' | 'destructive' | 'acknowledgement';
  label?: string;
  onConfirm?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-stone-50 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-2xl mb-4">{title}</h2>
        {children}
        {type !== 'passive' && type !== 'acknowledgement' && (
          <div className="flex gap-2 justify-end mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={onClose}
              tone={type === 'destructive' ? 'error' : undefined}
            />
            <Button
              label={label ? label : 'Confirm'}
              onClick={onConfirm ? onConfirm : onClose}
              tone={type === 'destructive' ? 'error' : undefined}
            />
          </div>
        )}
        {type === 'acknowledgement' && (
          <div className="flex gap-2 justify-end mt-4">
            <Button
              label={label ? label : 'OK'}
              onClick={onConfirm ? onConfirm : onClose}
            />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <IconButton
            icon={<X />}
            variant="ghost"
            onClick={onClose}
            label="close"
          />
        </div>
      </div>
    </div>
  );
}
