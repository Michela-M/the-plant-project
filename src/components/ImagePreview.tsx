import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Callout } from './Typography';

export default function ImagePreview({
  url,
  alt,
  description,
}: Readonly<{
  url: string;
  alt: string;
  description?: string;
}>) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const open = () => {
    if (!dialogRef.current) return;

    try {
      dialogRef.current.showModal();
    } catch {
      // Fallbackk for browsers that don't support the dialog element
    }

    dialogRef.current.setAttribute('open', '');
  };

  const close = () => {
    if (!dialogRef.current) return;

    try {
      dialogRef.current.close();
    } catch {
      // Fallback for browsers that don't support the dialog element
    }

    dialogRef.current.removeAttribute('open');
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dialogRef.current?.hasAttribute('open')) {
        close();
      }
    };

    globalThis.addEventListener('keydown', handleEscape);

    return () => {
      globalThis.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={open}
        type="button"
        className="focus-visible:outline-2 focus-visible:outline-green-800 rounded-md"
      >
        <img
          src={url}
          alt={alt}
          className="object-cover rounded-md cursor-zoom-in aspect-square w-full overflow-hidden"
        />
      </button>
      {description && (
        <Callout className="text-gray-500 mt-2">{description}</Callout>
      )}
      {createPortal(
        <dialog
          ref={dialogRef}
          aria-label="Image preview"
          onCancel={close}
          className="bg-transparent p-0 m-auto max-w-[100vw] max-h-screen backdrop:bg-black/80 backdrop:cursor-zoom-out"
        >
          <button
            type="button"
            aria-label="Close image preview backdrop"
            className="fixed inset-0 cursor-zoom-out"
            onClick={close}
          />
          <button
            type="button"
            aria-label="Close image preview"
            className="cursor-zoom-out block relative"
            onClick={close}
          >
            <img
              src={url}
              alt={`${alt} (enlarged)`}
              className="block max-w-[100vw] max-h-screen object-contain"
            />
          </button>
        </dialog>,
        document.body
      )}
    </div>
  );
}
