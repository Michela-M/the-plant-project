import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ImagePreview({
  url,
  alt,
  description,
}: {
  url: string;
  alt: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <button onClick={() => setIsOpen(true)}>
        <img
          src={url}
          alt={alt}
          className="object-cover rounded-md cursor-zoom-in"
        />
      </button>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <img
              src={url}
              alt={alt + ' (enlarged)'}
              className="max-w-full max-h-full object-contain"
            />
          </div>,
          document.body
        )}
    </div>
  );
}
