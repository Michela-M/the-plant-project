import { useRef, useEffect, useState, useId } from 'react';
import Button from './Button';

const isSafeImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url, globalThis.location.origin);
    const allowedSchemes = ['http:', 'https:', 'blob:'];
    if (!allowedSchemes.includes(parsed.protocol)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
};

export default function ImagePicker({
  previewUrl,
  onSelect,
  label,
}: Readonly<{
  previewUrl: string | null;
  onSelect: (file: File) => void;
  label: string;
}>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const focusListenerRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(true);
  const inputId = useId();

  const clearFocusListener = () => {
    if (focusListenerRef.current) {
      window.removeEventListener('focus', focusListenerRef.current);
      focusListenerRef.current = null;
    }
  };

  const safeUrl = isSafeImageUrl(previewUrl);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearFocusListener();
    };
  }, []);

  return (
    <fieldset aria-busy={loading} className="flex flex-col gap-2">
      <legend className="sr-only">{label}</legend>
      <output className="sr-only">
        {loading ? 'Opening file picker' : ''}
      </output>
      <div className="aspect-square overflow-hidden object-cover w-full">
        <img
          className="aspect-square object-cover w-full"
          src={safeUrl || '/public/images/placeholder.jpg'}
          alt={safeUrl ? 'Selected image preview' : 'No image selected'}
        />
      </div>

      <Button
        label="Upload image"
        ariaLabel={`Upload ${label}`}
        variant="outlined"
        size="sm"
        onClick={() => {
          setLoading(true);

          // Clear any existing focus listener before adding a new one
          clearFocusListener();

          // Add focus listener to detect when file picker closes
          const handleFocus = () => {
            if (isMountedRef.current) {
              setLoading(false);
            }
            focusListenerRef.current = null;
          };

          focusListenerRef.current = handleFocus;
          window.addEventListener('focus', handleFocus, { once: true });

          inputRef.current?.click();
        }}
        loading={loading}
        ariaControls={inputId}
      />

      <input
        id={inputId}
        ref={inputRef}
        data-testid="file-input"
        type="file"
        accept="image/png, image/jpeg"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          setLoading(false);
          // Clear the focus listener since the user selected a file
          clearFocusListener();
        }}
      />
    </fieldset>
  );
}
