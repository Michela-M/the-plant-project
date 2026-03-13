import { useRef, useEffect } from 'react';
import Button, { IconButton } from './Button';
import { X } from 'lucide-react';
import { H2 } from './Typography';

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
}: Readonly<ModalProps>) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const showDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;

    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  useEffect(() => {
    showDialog();
  }, []);

  const isDestructive = type === 'destructive';
  const isPassive = type === 'passive';
  const isAcknowledgement = type === 'acknowledgement';
  const showTwoButtons = !isPassive && !isAcknowledgement;
  const confirmLabel = label || (isAcknowledgement ? 'OK' : 'Confirm');
  const confirmHandler = onConfirm || onClose;

  const handleClose = () => {
    closeDialog();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="bg-transparent p-0 m-auto backdrop:bg-black/20 w-full max-w-md"
      aria-labelledby="modal-title"
    >
      <div className="bg-stone-50 rounded-lg shadow-lg p-6 relative">
        <div className="absolute top-2 right-2">
          <IconButton
            icon={<X />}
            variant="ghost"
            onClick={handleClose}
            label="Close modal"
          />
        </div>
        <H2 className="mb-4" id="modal-title">
          {title}
        </H2>
        {children}
        {!isPassive && (
          <div className="flex gap-2 justify-end mt-4">
            {showTwoButtons && (
              <Button
                label="Cancel"
                variant="outlined"
                onClick={handleClose}
                tone={isDestructive ? 'destructive' : undefined}
              />
            )}
            <Button
              label={confirmLabel}
              onClick={confirmHandler}
              tone={isDestructive ? 'destructive' : undefined}
            />
          </div>
        )}
      </div>
    </dialog>
  );
}
